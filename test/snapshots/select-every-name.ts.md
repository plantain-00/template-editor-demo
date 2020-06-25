# Snapshot report for `test/select-every-name.ts`

The actual snapshot is saved in `select-every-name.ts.snap`.

Generated by [AVA](https://avajs.dev).

## select every name

    {
      allNameRegions: [
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  color: '#000',
                  fontFamily: 'Aria',
                  fontSize: 50,
                  height: 60,
                  kind: 'text',
                  text: '¥11.0',
                  textExpression: '\'¥\' + (props.price or \'11.0\')',
                  width: 140,
                  x: 2.82,
                  y: 0,
                },
              ],
              height: 60,
              id: '0.041843723393758525',
              name: '价格',
              parameters: [
                'price',
              ],
              width: 140,
              x: 4.07,
              y: 358.58,
            },
            width: 28,
            x: 4.07,
            y: 344.58,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  id: '0.041843723393758525',
                  kind: 'reference',
                  props: '{ price: commodity?.prices?.[0] }',
                  propsIds: {
                    price: '3',
                  },
                  x: 765.48,
                  xExpression: 'props.width - 140',
                  y: -2.68,
                },
                {
                  id: '0.24088140356898147',
                  kind: 'reference',
                  props: '{ fontSize: 50, width: 500 }',
                  x: 0,
                  y: 0,
                },
              ],
              height: 54,
              id: '0.3543923342551776',
              name: '一价格商品',
              parameters: [
                'width',
              ],
              width: 906,
              widthExpression: 'props.width',
              widthExpressionId: '4',
              x: 607.14,
              y: -181.72,
            },
            width: 70,
            x: 607.14,
            y: -195.72,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              alignItems: 'start',
              contents: [
                {
                  id: '0.15280541103512402',
                  kind: 'reference',
                  props: '{ name: categories[0].name }',
                  x: 0,
                  y: 0,
                },
                {
                  id: '0.7719683197096188',
                  kind: 'reference',
                  repeat: 'commodity in categories[0].commodities',
                  x: 0,
                  y: 80,
                },
                {
                  id: '0.15280541103512402',
                  kind: 'reference',
                  props: '{ name: categories[1].name }',
                  x: 0,
                  y: 188,
                },
                {
                  id: '0.14261638357931328',
                  kind: 'reference',
                  repeat: 'commodity in categories[1].commodities',
                  x: 0,
                  y: 268,
                },
              ],
              display: 'flex',
              flexDirection: 'column',
              height: 800,
              id: '0.1354899940204275',
              justifyContent: 'start',
              name: '多品类',
              width: 960,
              x: 636.88,
              y: 575.49,
            },
            width: 42,
            x: 636.88,
            y: 561.49,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  id: '0.24088140356898147',
                  kind: 'reference',
                  props: '50',
                  x: 0,
                  y: 0,
                },
                {
                  id: '0.34988078104422415',
                  kind: 'reference',
                  props: '{ count: \'1\', price: commodity?.prices?.[0], width: 302 }',
                  propsIds: {
                    price: '3',
                  },
                  x: 0,
                  y: 56.56,
                },
                {
                  id: '0.34988078104422415',
                  kind: 'reference',
                  props: '{ count: \'2\', price: commodity?.prices?.[1], width: 302 }',
                  propsIds: {
                    price: '3',
                  },
                  x: 291.29,
                  y: 56.56,
                },
                {
                  id: '0.34988078104422415',
                  kind: 'reference',
                  props: '{ count: \'6\', price: commodity?.prices?.[2], width: 302 }',
                  propsIds: {
                    price: '3',
                  },
                  x: 602.38,
                  y: 53.73,
                },
              ],
              height: 108,
              id: '0.5154665917693448',
              name: '906px宽三价格商品',
              width: 906,
              x: 609.86,
              y: 6.83,
            },
            width: 154,
            x: 609.86,
            y: -7.17,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  hidden: false,
                  id: '0.3543923342551776',
                  if: 'commodity.prices.length == 1',
                  ifId: '1',
                  kind: 'reference',
                  props: '{ width: 906 }',
                  x: 0,
                  y: 0,
                },
                {
                  hidden: false,
                  id: '0.5154665917693448',
                  if: 'commodity.prices.length == 3',
                  ifId: '1',
                  kind: 'reference',
                  x: 0,
                  y: 0,
                },
              ],
              height: 108,
              heightExpression: 'commodity.prices.length === 1 ? 54 : 108',
              id: '0.7719683197096188',
              name: '906px宽商品',
              width: 906,
              x: 605.47,
              y: 238.53,
            },
            width: 112,
            x: 605.47,
            y: 224.53,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  color: '#000',
                  fontFamily: 'Aria',
                  fontSize: 50,
                  fontSizeExpression: 'props.fontSize',
                  fontSizeExpressionId: '4',
                  height: 54,
                  kind: 'text',
                  text: '冲绳海盐圣代',
                  textExpression: 'commodity.name',
                  textExpressionId: '2',
                  width: 400,
                  x: 4.85,
                  y: -6.3,
                },
              ],
              height: 54,
              id: '0.24088140356898147',
              name: '商品名称',
              parameters: [
                'fontSize',
                'width',
              ],
              width: 500,
              widthExpression: 'props.width',
              widthExpressionId: '4',
              x: 2.48,
              y: -169.09,
            },
            width: 56,
            x: 2.48,
            y: -183.09,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  color: '#000000',
                  fontFamily: 'Aria',
                  fontSize: 60,
                  height: 80,
                  kind: 'text',
                  text: '冰淇淋',
                  textExpression: 'props.name',
                  textExpressionId: '4',
                  width: 400,
                  x: 0,
                  y: 0,
                },
              ],
              height: 80,
              id: '0.15280541103512402',
              name: '品类名称',
              parameters: [
                'name',
              ],
              width: 400,
              x: 4.25,
              y: 155.76,
            },
            width: 56,
            x: 4.25,
            y: 141.76,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  id: '0.24088140356898147',
                  kind: 'reference',
                  props: '{ fontSize: 50, width: 500 }',
                  x: 0,
                  y: 0,
                },
                {
                  id: '0.34988078104422415',
                  kind: 'reference',
                  props: '{ count: \'1\', width: 553, price: commodity?.prices?.[0] }',
                  propsIds: {
                    price: '3',
                  },
                  x: 11.31,
                  y: 56.56,
                },
                {
                  id: '0.34988078104422415',
                  kind: 'reference',
                  props: '{ count: \'2\', price: commodity?.prices?.[1], width: 553 }',
                  propsIds: {
                    price: '3',
                  },
                  x: 8.48,
                  y: 110.29,
                },
                {
                  id: '0.34988078104422415',
                  kind: 'reference',
                  props: '{ count: \'6\', price: commodity?.prices?.[2], width: 553 }',
                  propsIds: {
                    price: '3',
                  },
                  x: 8.48,
                  y: 164.03,
                },
              ],
              height: 216,
              id: '0.37992718643373746',
              name: '553px宽三价格商品',
              width: 553,
              x: 1727.19,
              y: -83.46,
            },
            width: 154,
            x: 1727.19,
            y: -97.46,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  else: true,
                  id: '0.37992718643373746',
                  if: 'commodity.prices.length == 3',
                  ifId: '1',
                  kind: 'reference',
                  x: 0,
                  y: 0,
                },
                {
                  else: true,
                  id: '0.3543923342551776',
                  if: 'commodity.prices.length == 1',
                  ifId: '1',
                  kind: 'reference',
                  props: '{ width: 553 }',
                  x: 0,
                  y: 0,
                },
                {
                  else: true,
                  id: '0.9641177365517657',
                  kind: 'reference',
                  x: 0,
                  y: 0,
                },
              ],
              height: 216,
              heightExpression: 'commodity.prices.length === 3 ? 216 : 54 ',
              id: '0.14261638357931328',
              name: '553px宽商品',
              width: 553,
              x: 1723.02,
              y: 254.38,
            },
            width: 112,
            x: 1723.02,
            y: 240.38,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              alignItems: 'center',
              contents: [
                {
                  id: '0.4520673784851612',
                  kind: 'reference',
                  repeat: 'category in categories.slice(2, 5)',
                  repeatId: '5',
                  x: 0,
                  y: 270,
                },
              ],
              display: 'flex',
              flexDirection: 'column',
              height: 800,
              id: '0.5221493338129481',
              justifyContent: 'center',
              name: '多行有图商品',
              width: 960,
              x: 2157.29,
              y: 617.42,
            },
            width: 84,
            x: 2157.29,
            y: 603.42,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  id: '0.24088140356898147',
                  kind: 'reference',
                  props: '{ fontSize: 30, width: 220 }',
                  x: 0,
                  y: 0,
                },
                {
                  id: '0.041843723393758525',
                  kind: 'reference',
                  props: '{ price: commodity?.prices?.[0] }',
                  propsIds: {
                    price: '3',
                  },
                  x: 2.94,
                  y: 49.9,
                },
                {
                  height: 240,
                  kind: 'image',
                  url: 'https://arkie-amazon-test.oss-cn-hangzhou.aliyuncs.com/resources/8faa0634-84a6-43d8-8ae2-8a948192fab7.png',
                  urlExpression: 'commodity.image',
                  urlExpressionId: '2',
                  width: 280,
                  x: -50,
                  y: 75,
                },
              ],
              height: 260,
              id: '0.286787897677816',
              name: '有图商品',
              width: 180,
              x: 2878.72,
              y: -352.44,
            },
            width: 56,
            x: 2878.72,
            y: -366.44,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              alignItems: 'center',
              contents: [
                {
                  id: '0.286787897677816',
                  kind: 'reference',
                  repeat: 'commodity in category.commodities',
                  x: 0,
                  y: 0,
                },
              ],
              display: 'flex',
              flexDirection: 'row',
              height: 260,
              id: '0.4520673784851612',
              justifyContent: 'between',
              name: '一行有图商品',
              width: 960,
              x: 2829.92,
              y: 67.52,
            },
            width: 84,
            x: 2829.92,
            y: 53.519999999999996,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  color: '#000',
                  fontFamily: 'Aria',
                  fontSize: 40,
                  height: 54,
                  kind: 'text',
                  text: '1只',
                  textExpression: 'props.count + \'只\'',
                  width: 160,
                  x: 0,
                  y: 0,
                },
              ],
              height: 54,
              id: '0.9587802549007682',
              name: '价格描述',
              parameters: [
                'count',
              ],
              width: 160,
              x: 0,
              y: 0,
            },
            width: 56,
            x: 0,
            y: -14,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  id: '0.9587802549007682',
                  kind: 'reference',
                  props: '{ count: props.count }',
                  propsIds: {
                    count: '4',
                  },
                  x: 0,
                  y: 0,
                },
                {
                  id: '0.041843723393758525',
                  kind: 'reference',
                  props: '{ price: (props.price || \'11.0\') }',
                  x: 161.2,
                  xExpression: 'props.width - 140',
                  y: -8.48,
                },
              ],
              height: 54,
              id: '0.34988078104422415',
              name: '价格和价格描述',
              parameters: [
                'width',
                'price',
                'count',
              ],
              width: 302,
              widthExpression: 'props.width',
              widthExpressionId: '4',
              x: 1621.78,
              y: -331.76,
            },
            width: 98,
            x: 1621.78,
            y: -345.76,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  id: '0.1354899940204275',
                  kind: 'reference',
                  x: 0,
                  y: 0,
                },
                {
                  id: '0.5221493338129481',
                  kind: 'reference',
                  x: 960,
                  y: 0,
                },
              ],
              height: 800,
              id: '0.9175113630675271',
              name: '模板1',
              width: 1920,
              x: 814.84,
              y: 1559.32,
            },
            width: 42,
            x: 814.84,
            y: 1545.32,
            z: 0,
          },
        ],
        [
          {
            height: 14,
            parent: undefined,
            template: {
              contents: [
                {
                  color: '#ff0614',
                  fontFamily: 'Aria',
                  fontSize: 30,
                  height: 54,
                  kind: 'text',
                  text: '价格数量错误？',
                  width: 553,
                  x: 2.06,
                  y: -0.88,
                },
              ],
              height: 54,
              id: '0.9641177365517657',
              name: '价格不匹配错误',
              width: 553,
              x: 2212.73,
              y: -336.95,
            },
            width: 98,
            x: 2212.73,
            y: -350.95,
            z: 0,
          },
        ],
      ],
      count: 16,
    }