import { StyleGuide } from '../src/model'

export const styleGuide: StyleGuide = {
  "name": "test",
  "templates": [
    {
      "id": "0.041843723393758525",
      "x": 4.07,
      "y": 358.58,
      "width": 140,
      "height": 60,
      "contents": [
        {
          "kind": "text",
          "text": "¥11.0",
          "color": "#000",
          "fontFamily": "Aria",
          "fontSize": 50,
          "x": 2.82,
          "y": 0,
          "width": 140,
          "height": 60,
          "textExpression": "'¥' + (props.price or '11.0')"
        }
      ],
      "parameters": [
        "price"
      ],
      "name": "价格"
    },
    {
      "id": "0.3543923342551776",
      "x": 607.14,
      "y": -181.72,
      "width": 906,
      "height": 54,
      "contents": [
        {
          "kind": "reference",
          "id": "0.041843723393758525",
          "x": 765.48,
          "y": -2.68,
          "props": "{ price: commodity?.prices?.[0] }",
          "propsIds": {
            "price": "3"
          },
          "xExpression": "props.width - 140"
        },
        {
          "kind": "reference",
          "id": "0.24088140356898147",
          "x": 0,
          "y": 0,
          "props": "{ fontSize: 50, width: 500 }"
        }
      ],
      "parameters": [
        "width"
      ],
      "widthExpression": "props.width",
      "widthExpressionId": "4",
      "name": "一价格商品"
    },
    {
      "id": "0.1354899940204275",
      "x": 636.88,
      "y": 575.49,
      "width": 960,
      "height": 800,
      "contents": [
        {
          "kind": "reference",
          "id": "0.15280541103512402",
          "x": 0,
          "y": 0,
          "props": "{ name: categories[0].name }"
        },
        {
          "kind": "reference",
          "id": "0.7719683197096188",
          "x": 0,
          "y": 80,
          "repeat": "commodity in categories[0].commodities"
        },
        {
          "kind": "reference",
          "id": "0.15280541103512402",
          "x": 0,
          "y": 188,
          "props": "{ name: categories[1].name }"
        },
        {
          "kind": "reference",
          "id": "0.14261638357931328",
          "x": 0,
          "y": 268,
          "repeat": "commodity in categories[1].commodities"
        }
      ],
      "display": "flex",
      "flexDirection": "column",
      "justifyContent": "start",
      "alignItems": "start",
      "name": "多品类"
    },
    {
      "id": "0.5154665917693448",
      "x": 609.86,
      "y": 6.83,
      "width": 906,
      "height": 108,
      "contents": [
        {
          "kind": "reference",
          "id": "0.24088140356898147",
          "x": 0,
          "y": 0,
          "props": "50"
        },
        {
          "kind": "reference",
          "id": "0.34988078104422415",
          "x": 0,
          "y": 56.56,
          "props": "{ count: '1', price: commodity?.prices?.[0], width: 302 }",
          "propsIds": {
            "price": "3"
          }
        },
        {
          "kind": "reference",
          "id": "0.34988078104422415",
          "x": 291.29,
          "y": 56.56,
          "props": "{ count: '2', price: commodity?.prices?.[1], width: 302 }",
          "propsIds": {
            "price": "3"
          }
        },
        {
          "kind": "reference",
          "id": "0.34988078104422415",
          "x": 602.38,
          "y": 53.73,
          "props": "{ count: '6', price: commodity?.prices?.[2], width: 302 }",
          "propsIds": {
            "price": "3"
          }
        }
      ],
      "name": "906px宽三价格商品"
    },
    {
      "id": "0.7719683197096188",
      "x": 605.47,
      "y": 238.53,
      "width": 906,
      "height": 108,
      "contents": [
        {
          "kind": "reference",
          "id": "0.3543923342551776",
          "x": 0,
          "y": 0,
          "if": "commodity.prices.length == 1",
          "hidden": false,
          "props": "{ width: 906 }",
          "ifId": "1"
        },
        {
          "kind": "reference",
          "id": "0.5154665917693448",
          "x": 0,
          "y": 0,
          "if": "commodity.prices.length == 3",
          "hidden": false,
          "ifId": "1"
        }
      ],
      "heightExpression": "commodity.prices.length === 1 ? 54 : 108",
      "name": "906px宽商品"
    },
    {
      "id": "0.24088140356898147",
      "contents": [
        {
          "kind": "text",
          "text": "冲绳海盐圣代",
          "color": "#000",
          "fontFamily": "Aria",
          "fontSize": 50,
          "x": 4.85,
          "y": -6.3,
          "width": 400,
          "height": 54,
          "textExpression": "commodity.name",
          "fontSizeExpression": "props.fontSize",
          "textExpressionId": "2",
          "fontSizeExpressionId": "4"
        }
      ],
      "x": 2.48,
      "y": -169.09,
      "width": 500,
      "height": 54,
      "parameters": [
        "fontSize",
        "width"
      ],
      "widthExpression": "props.width",
      "widthExpressionId": "4",
      "name": "商品名称"
    },
    {
      "id": "0.15280541103512402",
      "contents": [
        {
          "kind": "text",
          "text": "冰淇淋",
          "color": "#000000",
          "fontFamily": "Aria",
          "fontSize": 60,
          "x": 0,
          "y": 0,
          "width": 400,
          "height": 80,
          "textExpression": "props.name",
          "textExpressionId": "4"
        }
      ],
      "x": 4.25,
      "y": 155.76,
      "width": 400,
      "height": 80,
      "parameters": [
        "name"
      ],
      "name": "品类名称"
    },
    {
      "id": "0.37992718643373746",
      "x": 1727.19,
      "y": -83.46,
      "width": 553,
      "height": 216,
      "contents": [
        {
          "kind": "reference",
          "id": "0.24088140356898147",
          "x": 0,
          "y": 0,
          "props": "{ fontSize: 50, width: 500 }"
        },
        {
          "kind": "reference",
          "id": "0.34988078104422415",
          "x": 11.31,
          "y": 56.56,
          "props": "{ count: '1', width: 553, price: commodity?.prices?.[0] }",
          "propsIds": {
            "price": "3"
          }
        },
        {
          "kind": "reference",
          "id": "0.34988078104422415",
          "x": 8.48,
          "y": 110.29,
          "props": "{ count: '2', price: commodity?.prices?.[1], width: 553 }",
          "propsIds": {
            "price": "3"
          }
        },
        {
          "kind": "reference",
          "id": "0.34988078104422415",
          "x": 8.48,
          "y": 164.03,
          "props": "{ count: '6', price: commodity?.prices?.[2], width: 553 }",
          "propsIds": {
            "price": "3"
          }
        }
      ],
      "name": "553px宽三价格商品"
    },
    {
      "id": "0.14261638357931328",
      "x": 1723.02,
      "y": 254.38,
      "width": 553,
      "height": 216,
      "contents": [
        {
          "kind": "reference",
          "id": "0.37992718643373746",
          "x": 0,
          "y": 0,
          "if": "commodity.prices.length == 3",
          "ifId": "1",
          "else": true
        },
        {
          "kind": "reference",
          "id": "0.3543923342551776",
          "x": 0,
          "y": 0,
          "props": "{ width: 553 }",
          "if": "commodity.prices.length == 1",
          "ifId": "1",
          "else": true
        },
        {
          "kind": "reference",
          "id": "0.9641177365517657",
          "x": 0,
          "y": 0,
          "else": true
        }
      ],
      "heightExpression": "commodity.prices.length === 3 ? 216 : 54 ",
      "name": "553px宽商品"
    },
    {
      "id": "0.5221493338129481",
      "x": 2157.29,
      "y": 617.42,
      "width": 960,
      "height": 800,
      "contents": [
        {
          "kind": "reference",
          "id": "0.4520673784851612",
          "x": 0,
          "y": 270,
          "repeat": "category in categories.slice(2, 5)",
          "repeatId": "5"
        }
      ],
      "display": "flex",
      "flexDirection": "column",
      "justifyContent": "center",
      "alignItems": "center",
      "name": "多行有图商品"
    },
    {
      "id": "0.286787897677816",
      "x": 2878.72,
      "y": -352.44,
      "width": 180,
      "height": 260,
      "contents": [
        {
          "kind": "reference",
          "id": "0.24088140356898147",
          "x": 0,
          "y": 0,
          "props": "{ fontSize: 30, width: 220 }"
        },
        {
          "kind": "reference",
          "id": "0.041843723393758525",
          "x": 2.94,
          "y": 49.9,
          "props": "{ price: commodity?.prices?.[0] }",
          "propsIds": {
            "price": "3"
          }
        },
        {
          "kind": "image",
          "url": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/8faa0634-84a6-43d8-8ae2-8a948192fab7.png",
          "x": -50,
          "y": 75,
          "width": 280,
          "height": 240,
          "urlExpression": "commodity.image",
          "urlExpressionId": "2"
        }
      ],
      "name": "有图商品"
    },
    {
      "id": "0.4520673784851612",
      "x": 2829.92,
      "y": 67.52,
      "width": 960,
      "height": 260,
      "contents": [
        {
          "kind": "reference",
          "id": "0.286787897677816",
          "x": 0,
          "y": 0,
          "repeat": "commodity in category.commodities"
        }
      ],
      "display": "flex",
      "flexDirection": "row",
      "alignItems": "center",
      "justifyContent": "between",
      "name": "一行有图商品"
    },
    {
      "id": "0.9587802549007682",
      "contents": [
        {
          "kind": "text",
          "text": "1只",
          "color": "#000",
          "fontFamily": "Aria",
          "fontSize": 40,
          "x": 0,
          "y": 0,
          "width": 160,
          "height": 54,
          "textExpression": "props.count + '只'"
        }
      ],
      "x": 0,
      "y": 0,
      "width": 160,
      "height": 54,
      "parameters": [
        "count"
      ],
      "name": "价格描述"
    },
    {
      "id": "0.34988078104422415",
      "x": 1621.78,
      "y": -331.76,
      "width": 302,
      "height": 54,
      "contents": [
        {
          "kind": "reference",
          "id": "0.9587802549007682",
          "x": 0,
          "y": 0,
          "props": "{ count: props.count }",
          "propsIds": {
            "count": "4"
          }
        },
        {
          "kind": "reference",
          "id": "0.041843723393758525",
          "x": 161.2,
          "y": -8.48,
          "props": "{ price: (props.price || '11.0') }",
          "xExpression": "props.width - 140"
        }
      ],
      "parameters": [
        "width",
        "price",
        "count"
      ],
      "widthExpression": "props.width",
      "widthExpressionId": "4",
      "name": "价格和价格描述"
    },
    {
      "id": "0.9175113630675271",
      "x": 814.84,
      "y": 1559.32,
      "width": 1920,
      "height": 800,
      "contents": [
        {
          "kind": "reference",
          "id": "0.1354899940204275",
          "x": 0,
          "y": 0
        },
        {
          "kind": "reference",
          "id": "0.5221493338129481",
          "x": 960,
          "y": 0
        }
      ],
      "name": "模板1"
    },
    {
      "id": "0.9641177365517657",
      "x": 2212.73,
      "y": -336.95,
      "width": 553,
      "height": 54,
      "contents": [
        {
          "kind": "text",
          "text": "价格数量错误？",
          "color": "#ff0614",
          "fontFamily": "Aria",
          "fontSize": 30,
          "x": 2.06,
          "y": -0.88,
          "width": 553,
          "height": 54
        }
      ],
      "name": "价格不匹配错误"
    }
  ]
}

export const model = {
  "categories": [
    {
      "name": "冰淇淋",
      "id": "",
      "commodities": [
        {
          "name": "原味冰淇淋花筒",
          "id": "",
          "prices": [
            "8.0"
          ]
        },
        {
          "name": "原味圣代珍珠酱",
          "id": "",
          "prices": [
            "1.0",
            "1.5",
            "3.0"
          ]
        },
        {
          "name": "原味圣代蓝莓酱",
          "id": "",
          "prices": [
            "7.0"
          ]
        }
      ]
    },
    {
      "name": "热甜点",
      "id": "",
      "commodities": [
        {
          "name": "红豆派",
          "id": "",
          "prices": [
            "1.1",
            "2.2",
            "3.3"
          ],
          "description": "",
          "image": ""
        },
        {
          "name": "葡式蛋挞",
          "id": "",
          "prices": [
            "1.2"
          ],
          "description": "",
          "image": ""
        },
        {
          "name": "新公爵蓝莓蛋挞",
          "id": "",
          "prices": [
            "3.3"
          ],
          "description": "",
          "image": ""
        }
      ]
    },
    {
      "name": "小食配餐1",
      "id": "",
      "commodities": [
        {
          "name": "香辣鸡翅",
          "id": "",
          "description": "2块",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/8faa0634-84a6-43d8-8ae2-8a948192fab7.png",
          "prices": [
            "5.0"
          ]
        },
        {
          "name": "新奥尔良烤翅",
          "id": "",
          "description": "2块",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/48197f6e-9315-486b-86d9-b23c2d609e6d.png",
          "prices": [
            "11.0"
          ]
        },
        {
          "name": "香辣黄金鸡柳",
          "id": "",
          "description": "4块",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/7201a2e0-60a8-4a09-86a3-37067ae1295b.png",
          "prices": [
            "10.0"
          ]
        },
        {
          "name": "热辣香骨鸡",
          "id": "",
          "description": "3块",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/9cd1dab4-3e95-4f63-8149-c7f57ef1cf75.png",
          "prices": [
            "7.0"
          ]
        }
      ]
    },
    {
      "name": "小食配餐2",
      "id": "",
      "commodities": [
        {
          "name": "黄金鸡块",
          "id": "",
          "description": "5块",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/b40c5b28-2efc-4140-8594-98a898adb439.png",
          "prices": [
            "7.0"
          ]
        },
        {
          "name": "薯条",
          "id": "",
          "description": "",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/bc667702-d535-407e-b604-0ee1df988ca3.png",
          "prices": [
            "8.0"
          ]
        },
        {
          "name": "吮指原味鸡",
          "id": "",
          "description": "1块",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/91c593de-8e44-43ce-8c98-16514bda5a9b.png",
          "prices": [
            "1.0"
          ]
        },
        {
          "name": "藤椒肯大大鸡排",
          "id": "",
          "description": "1块",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/595fa68f-3168-4296-ad93-7cbefe3fde74.png",
          "prices": [
            "2.0"
          ]
        },
        {
          "name": "劲爆鸡米花",
          "id": "",
          "description": "",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/55b87689-c4b1-4c06-8ce6-e7d962cae69f.png",
          "prices": [
            "3.0"
          ]
        }
      ]
    },
    {
      "name": "小食配餐3",
      "id": "",
      "commodities": [
        {
          "name": "醇香土豆泥",
          "id": "",
          "description": "",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/b34385e3-5783-4ce3-acf0-ec9134b189f0.png",
          "prices": [
            "11.0"
          ]
        },
        {
          "name": "芙蓉荟蔬汤",
          "id": "",
          "description": "",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/62e7bb70-3752-473a-aa0b-388c06c2ee1f.png",
          "prices": [
            "10.8"
          ]
        },
        {
          "name": "香甜粟米棒",
          "id": "",
          "description": "",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/163475f8-77d7-482a-a212-bd579b7fdfaa.png",
          "prices": [
            "6.7"
          ]
        },
        {
          "name": "鲜蔬沙拉",
          "id": "",
          "description": "",
          "image": "https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/129a473e-ba6c-4f1a-bfa2-50fcddcd0e47.png",
          "prices": [
            "17.0"
          ]
        }
      ]
    }
  ]
}

