import { StyleGuide } from "./model"

export const styleGuide: StyleGuide = {
  name: 'test',
  templates: [
    {
      id: '1',
      name: '组件',
      x: 0,
      y: 0,
      width: 500,
      height: 300,
      contents: [
        {
          kind: 'text',
          text: 'test',
          fontFamily: 'serif',
          fontSize: 50,
          color: '',
          colorExpression: 'variable.textColor',
          colorExpressionId: '6',
          width: 100,
          height: 100,
          x: 10,
          y: 10,
        },
        {
          kind: 'image',
          url: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png',
          width: 100,
          height: 100,
          x: 210,
          y: 10,
          xExpression: 'props.width - 300',
        }
      ],
      parameters: ['width', 'color'],
      widthExpression: 'props.width',
      widthExpressionId: '4'
    },
    {
      id: '2',
      name: '模板',
      x: 600,
      y: 0,
      width: 1100,
      height: 400,
      contents: [
        {
          kind: 'color',
          x: 0,
          y: 0,
          width: 1100,
          height: 400,
          color: '',
          colorExpression: 'variable.backgroundColor',
          colorExpressionId: '6',
        },
        {
          kind: 'reference',
          id: '1',
          x: 10,
          y: 10,
          props: '{ width: 400 }'
        },
        {
          kind: 'reference',
          id: '1',
          x: 550,
          y: 10
        }
      ]
    }
  ],
  variables: [
    {
      kind: 'color',
      name: 'backgroundColor',
      displayName: 'background color',
      value: '#cccccc'
    },
    {
      kind: 'color',
      name: 'textColor',
      displayName: 'text color',
      value: '#ff0000'
    },
  ]
}
