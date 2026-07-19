/**
 * English prose - the source of truth every other locale falls back to.
 *
 * Split per category so each file sits beside the registry file it
 * describes, and so adding a category touches one import rather than a
 * 700-entry monolith.
 */
import type { ComponentContentMap } from '../types';

import { buttonsContent } from './buttons';
import { cardsContent } from './cards';
import { faqContent } from './faq';
import { loadersContent } from './loaders';
import { animationContent } from './animation';
import { navbarContent } from './navbar';
import { footerContent } from './footer';
import { heroContent } from './hero';
import { marketingContent } from './marketing';
import { tabsContent } from './tabs';
import { carouselContent } from './carousel';
import { formsTextContent } from './forms-text';
import { formsSelectContent } from './forms-select';
import { formsChoiceContent } from './forms-choice';
import { servicesContent } from './services';
import { aboutContent } from './about';
import { modalsContent } from './modals';
import { popoverContent } from './popover';
import { dropdownsContent } from './dropdowns';
import { notificationsContent } from './notifications';
import { alertsContent } from './alerts';
import { sidebarsContent } from './sidebars';
import { docksContent } from './docks';
import { fabContent } from './fab';
import { comparisonsContent } from './comparisons';
import { pricingContent } from './pricing';
import { galleriesContent } from './galleries';
import { paginationContent } from './pagination';
import { resetPasswordContent } from './reset-password';
import { changePasswordContent } from './change-password';
import { checkoutContent } from './checkout';
import { cartContent } from './cart';
import { contactContent } from './contact';
import { socialContent } from './social';
import { bentoContent } from './bento';
import { globesContent } from './globes';
import { errorPagesContent } from './error-pages';
import { teamContent } from './team';
import { statsContent } from './stats';
import { signUpContent } from './sign-up';
import { signInContent } from './sign-in';
import { ctaContent } from './cta';
import { tablesContent } from './tables';
import { tourContent } from './tour';
import { togglesContent } from './toggles';
import { searchBarsContent } from './search-bars';
import { listsContent } from './lists';
import { fileUploadsContent } from './file-uploads';
import { colorPickersContent } from './color-pickers';
import { tagsContent } from './tags';
import { progressContent } from './progress';
import { menusContent } from './menus';
import { fileTreesContent } from './file-trees';
import { timePickersContent } from './time-pickers';
import { datePickersContent } from './date-pickers';
import { tooltipsContent } from './tooltips';
import { cursorsContent } from './cursors';
import { calendarContent } from './calendar';
import { steppersContent } from './steppers';
import { mapsContent } from './maps';
import { marqueesContent } from './marquees';
import { timelineContent } from './timeline';
import { testimonialsContent } from './testimonials';
import { badgesContent } from './badges';
import { avatarsContent } from './avatars';
import { gradientsContent } from './gradients';
import { blogContent } from './blog';
import { imagesContent } from './images';

const content: ComponentContentMap = {
  ...buttonsContent,
  ...cardsContent,
  ...faqContent,
  ...loadersContent,
  ...animationContent,
  ...navbarContent,
  ...footerContent,
  ...heroContent,
  ...marketingContent,
  ...tabsContent,
  ...carouselContent,
  ...formsTextContent,
  ...formsSelectContent,
  ...formsChoiceContent,
  ...servicesContent,
  ...aboutContent,
  ...modalsContent,
  ...popoverContent,
  ...dropdownsContent,
  ...notificationsContent,
  ...alertsContent,
  ...sidebarsContent,
  ...docksContent,
  ...fabContent,
  ...comparisonsContent,
  ...pricingContent,
  ...galleriesContent,
  ...paginationContent,
  ...gradientsContent,
  ...avatarsContent,
  ...badgesContent,

  ...testimonialsContent,
  ...timelineContent,
  ...marqueesContent,
  ...mapsContent,
  ...steppersContent,
  ...calendarContent,
  ...cursorsContent,
  ...tooltipsContent,
  ...datePickersContent,
  ...timePickersContent,
  ...fileTreesContent,
  ...menusContent,
  ...progressContent,
  ...tagsContent,
  ...colorPickersContent,
  ...fileUploadsContent,
  ...listsContent,
  ...searchBarsContent,
  ...togglesContent,
  ...tourContent,
  ...tablesContent,
  ...ctaContent,
  ...signInContent,
  ...signUpContent,
  ...statsContent,
  ...teamContent,
  ...errorPagesContent,
  ...globesContent,
  ...bentoContent,
  ...socialContent,
  ...contactContent,
  ...cartContent,
  ...checkoutContent,
  ...changePasswordContent,
  ...resetPasswordContent,
  ...blogContent,
  ...imagesContent,
};

export default content;
