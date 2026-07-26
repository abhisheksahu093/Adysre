import type {
  Diagnostic,
  FieldDescriptor,
  FieldProviderPlugin,
  VariableDescriptor,
  VariableProviderPlugin,
} from '@adysre/rules-types';

/**
 * Where the field picker's list comes from.
 *
 * Providers are async because most sources are: a schema fetched once, a table
 * described by the database, a form definition loaded with the page. Several
 * can contribute at once and the picker shows the union, which is why the
 * registry keeps them as a list rather than a map.
 *
 * A provider that fails does NOT blank the picker. Losing one source is a
 * degraded list; losing all of them because one server was slow is a builder
 * nobody can use. So the failures come back beside the results and the editor
 * decides what to say about them.
 */

export interface ResolvedFields {
  fields: FieldDescriptor[];
  diagnostics: Diagnostic[];
}

export interface ResolvedVariables {
  variables: VariableDescriptor[];
  diagnostics: Diagnostic[];
}

export async function resolveFields(
  providers: readonly FieldProviderPlugin[],
  context?: unknown,
): Promise<ResolvedFields> {
  const diagnostics: Diagnostic[] = [];
  const seen = new Map<string, FieldDescriptor>();

  const results = await Promise.allSettled(
    providers.map(async (provider) => provider.fields(context)),
  );

  results.forEach((result, index) => {
    const provider = providers[index];
    if (result.status === 'rejected') {
      diagnostics.push(failure(provider?.id ?? 'field provider', result.reason));
      return;
    }

    for (const descriptor of result.value) {
      // First provider to claim a path wins, and the registry keeps providers
      // in the order they were registered - so a host's own fields override the
      // ones a shared package offered, which is the way round anyone expects.
      if (!seen.has(descriptor.path)) seen.set(descriptor.path, descriptor);
    }
  });

  return { fields: [...seen.values()].sort(byGroupThenLabel), diagnostics };
}

export async function resolveVariables(
  providers: readonly VariableProviderPlugin[],
  context?: unknown,
): Promise<ResolvedVariables> {
  const diagnostics: Diagnostic[] = [];
  const seen = new Map<string, VariableDescriptor>();

  const results = await Promise.allSettled(
    providers.map(async (provider) => provider.variables(context)),
  );

  results.forEach((result, index) => {
    const provider = providers[index];
    if (result.status === 'rejected') {
      diagnostics.push(failure(provider?.id ?? 'variable provider', result.reason));
      return;
    }
    for (const descriptor of result.value) {
      if (!seen.has(descriptor.name)) seen.set(descriptor.name, descriptor);
    }
  });

  return {
    variables: [...seen.values()].sort((left, right) => left.label.localeCompare(right.label)),
    diagnostics,
  };
}

function failure(id: string, reason: unknown): Diagnostic {
  return {
    severity: 'warning',
    code: 'provider_failed',
    message: `"${id}" could not be read: ${reason instanceof Error ? reason.message : String(reason)}`,
  };
}

function byGroupThenLabel(left: FieldDescriptor, right: FieldDescriptor): number {
  const group = (left.group ?? '').localeCompare(right.group ?? '');
  return group !== 0 ? group : left.label.localeCompare(right.label);
}
