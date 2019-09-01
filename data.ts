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
          color: 'red',
          width: 100,
          height: 100,
          x: 10,
          y: 10,
          characters: [
            {
              text: 't'
            },
            {
              text: 'e'
            },
            {
              text: 's'
            },
            {
              text: 't'
            },
          ]
        },
        {
          kind: 'image',
          url: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png',
          width: 100,
          height: 100,
          x: 210,
          y: 10,
        }
      ]
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
