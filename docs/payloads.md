# Payloads

## APIs
API supports pagination default page size is 2

### Get Products

**GET** */products*
API supports filtering by source [api, import]

Response:

```js
{
    "docs": {
        "products": [
            {
                "productId": "2250527",
                "company": "cheer",
                "source": "api",
                "name": "12-volt lith-ion drill w/ bonus case & 150-piece socket set"
            },
            {
                "productId": "2250585",
                "name": "astro pneumatic 223k air belt sander",
                "company": "astro",
                "source": "import"
            }
        ],
        "count": 35
    },
    "pagination": {
        "totalSize": 35,
        "pageSize": 2,
        "pages": 18,
        "page": 1
    }
}
```


**GET** */products/:id*

Response:

```js
{
  "productId": "123abc",
  "name": "stanley fatmax value bundle",
  "company": "stanley",
  "source": "api"
}
```

**GET** */products/:id/campaigns*
**GET** */products/:id/campaigns?status=active*

API supports filtering product's campaign by status [active,pending,archived]

Response:

```js
[
    {
        "campaignId": "50505",
        "name": "cabela",
        "product": "2250570",
        "startDate": "2018-02-05T08:00:00.000Z",
        "endDate": "2018-03-05T08:00:00.000Z",
        "source": "api"
    }
]
```

### UPDATE Products

**PUT** */products/:id*

Can't update a product that has an active campaign

Request body:

```js
{
  "name": "cat1",
  "company": "cat2"
}
```
### CREATE Products

**POST** */products*

Request body:

```js
{
  "name": "cat1", [mandatory]
  "company": "cat2" [mandatory]
}
```
### Delete Product

**DELETE** */products/:id*

Can't delete a product that has an active campaign


### IMPORT Products/Campaigns

**POST** */csv*

Accepts a CSV multipart file upload and mandatory entity file name `products` or `campaigns` fields.
Can't import new products and campaigns at the same time, campaign's product must exist first


### GET Campaigns

**GET** */campaigns/:id*

Response:

```js
{
    "campaignId": "50505",
    "name": "cabela",
    "product": "2250570",
    "startDate": "2018-02-05T08:00:00.000Z",
    "endDate": "2018-03-05T08:00:00.000Z",
    "source": "api"
}
```

**GET** */campaigns/*
API supports filtering by source [api, import] and/or campaign status [active, pending, archived]

Response:

```js
{
    "docs": {
        "campaigns": [
            {
                "campaignId": "50505",
                "name": "cabela",
                "product": "2250570",
                "startDate": "2018-02-05T08:00:00.000Z",
                "endDate": "2018-03-05T08:00:00.000Z",
                "source": "api"
            },
            {
                "campaignId": "50503",
                "name": "boston scientific corporation",
                "product": "2250573",
                "startDate": "2018-03-10T03:00:00.000Z",
                "endDate": "2018-03-15T03:00:00.000Z",
                "source": "api"
            }
        ],
        "count": 6
    },
    "pagination": {
        "totalSize": 6,
        "pageSize": 2,
        "pages": 3,
        "page": 1
    }
}
```

### CREATE Campaign
Request body:

```js
{
    "name": "cabela", [mandatory]
    "product": "2250570", [mandatory]
    "startDate": "2018-02-05T08:00:00.000Z", [mandatory]
    "endDate": "2018-03-05T08:00:00.000Z" [mandatory]
}
```

### UPDATE Campaign

**PUT** */campaigns/:id*

Can't update an active campaign
Request body:

```js
{
    "name": "cabela",
    "product": "2250570",
    "startDate": "2018-02-05T08:00:00.000Z",
    "endDate": "2018-03-05T08:00:00.000Z"
}
```

### Delete Campaign

**DELETE** */campaigns/:id*
