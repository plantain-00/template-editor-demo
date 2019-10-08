import { StyleGuide } from "./model"

export const styleGuide: StyleGuide = {
  name: 'test',
  templates: [
    {
      id: '1',
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
          color: '#FF0000',
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
      parameters: ['width'],
      widthExpression: 'props.width'
    },
    {
      id: '2',
      x: 600,
      y: 0,
      width: 1100,
      height: 400,
      contents: [
        {
          kind: 'reference',
          id: '1',
          x: 10,
          y: 10,
          props: '{width: 400}'
        },
        {
          kind: 'reference',
          id: '1',
          x: 550,
          y: 10,
        }
      ]
    }
  ],
}
