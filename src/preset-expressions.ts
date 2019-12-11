import { PresetExpression } from './model'

export const presetExpressions: PresetExpression[] = [
  {
    id: '1',
    name: 'price count',
    expression: 'commodity.prices.length == 3',
    variables: [
      {
        tokenIndex: 6
      },
      'prices'
    ]
  },
  {
    id: '2',
    name: 'commodity property',
    expression: 'commodity.name',
    variables: [
      'commodity',
      {
        tokenIndex: 2,
        enum: [
          'name',
          'id',
          'description',
          'image'
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'price index',
    expression: 'commodity?.prices?.[0]',
    variables: [
      'the',
      {
        tokenIndex: 5
      },
      'th price'
    ]
  },
  {
    id: '4',
    name: 'component parameter',
    expression: 'props.name',
    variables: [
      'component parameter',
      {
        tokenIndex: 2,
        internal: 'component parameters'
      }
    ]
  },
  {
    id: '5',
    name: 'categories range',
    expression: 'categories.slice(0, 1)',
    variables: [
      'categories',
      {
        tokenIndex: 4
      },
      'until',
      {
        tokenIndex: 6
      }
    ]
  },
  {
    id: '6',
    name: 'variable',
    expression: 'variable.name',
    variables: [
      'variable',
      {
        tokenIndex: 2,
        internal: 'variable'
      }
    ]
  },
]
