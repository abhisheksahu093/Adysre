# API_STANDARDS

## Base URL
/api/v1

## Response
```json
{
  "success": true,
  "message": "",
  "data": {},
  "meta": {}
}
```

## Errors
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": ""
}
```

## Pagination
page,pageSize,total

## Filtering
?filter[field]=value

## Sorting
?sort=createdAt:desc

## Versioning
Never break v1.
