const stringSchema = {
  type: 'string',
  title: '字符串',
  propertyName: 'value',
  requiredWhen: [
    'type',
    '===',
    'StringLiteral'
  ],
  propertyOrder: 1
}

const numericSchema = {
  type: 'number',
  title: '数字',
  propertyName: 'value',
  requiredWhen: [
    'type',
    '===',
    'NumericLiteral'
  ],
  propertyOrder: 1
}

const identifierSchema = {
  name: {
    type: 'string',
    title: '名称',
    requiredWhen: [
      'type',
      '===',
      'Identifier'
    ],
    propertyOrder: 1
  }
}

const expressionTypeEnum = [
  'NumericLiteral',
  'StringLiteral',
  'BooleanLiteral',
  'NullLiteral',
  'ArrayExpression',
  'ObjectExpression',
  'Identifier',
  'ThisExpression',
  'BinaryExpression',
  'LogicalExpression',
  'UnaryExpression',
  'MemberExpression',
  'ConditionalExpression',
  'CallExpression',
  'ArrowFunctionExpression'
]

const expressionTypeEnumTitles = [
  '数字',
  '字符串',
  '布尔值',
  'null',
  '数组',
  '对象',
  '标记符',
  'this',
  '二元表达式',
  '逻辑表达式',
  '一元表达式',
  '取成员',
  '条件表达式',
  '函数调用',
  '箭头函数'
]

const expressionSchema = {
  stringValue: stringSchema,
  numericValue: numericSchema,
  booleanValue: {
    type: 'boolean',
    title: '值',
    propertyName: 'value',
    requiredWhen: [
      'type',
      '===',
      'BooleanLiteral'
    ],
    propertyOrder: 1
  },
  ...identifierSchema,
  binaryOperator: {
    type: 'string',
    title: '运算符',
    propertyName: 'operator',
    enum: [
      '**',
      '*',
      '/',
      '%',
      '+',
      '-',
      '<<',
      '>>',
      '>>>',
      '>',
      '<',
      '>=',
      '<=',
      '==',
      '!=',
      '===',
      '!==',
      '&',
      '^',
      '|',
      '|>'
    ],
    enumTitles: [
      '幂乘',
      '乘',
      '除',
      '除余',
      '加',
      '减',
      '按位左移',
      '按位右移',
      '按位无符号右移',
      '大于',
      '小于',
      '大于等于',
      '小于等于',
      '等于',
      '不等于',
      '全等于',
      '不全等于',
      '位与',
      '位异或',
      '位或',
      '管道'
    ],
    requiredWhen: [
      'type',
      '===',
      'BinaryExpression'
    ],
    propertyOrder: 2
  },
  unaryOperator: {
    type: 'string',
    title: '运算符',
    propertyName: 'operator',
    enum: [
      '+',
      '-',
      '!',
      '~',
      '%',
      'await'
    ],
    enumTitles: [
      '正',
      '负',
      '非',
      '位非',
      '百分比',
      '异步等待'
    ],
    requiredWhen: [
      'type',
      '===',
      'UnaryExpression'
    ],
    propertyOrder: 2
  },
  logicalOperator: {
    type: 'string',
    title: '运算符',
    propertyName: 'operator',
    enum: [
      '||',
      '&&',
      '??'
    ],
    enumTitles: [
      '或',
      '且',
      '空值或'
    ],
    requiredWhen: [
      'type',
      '===',
      'LogicalExpression'
    ],
    propertyOrder: 2
  },
  left: {
    type: undefined,
    $ref: '#/definitions/expression',
    title: '左操作符',
    requiredWhen: [
      'type',
      'in',
      ['BinaryExpression', 'LogicalExpression']
    ],
    propertyOrder: 1
  },
  right: {
    type: undefined,
    $ref: '#/definitions/expression',
    title: '右操作符',
    requiredWhen: [
      'type',
      'in',
      ['BinaryExpression', 'LogicalExpression']
    ],
    propertyOrder: 3
  },
  argument: {
    type: undefined,
    $ref: '#/definitions/expression',
    title: '参数',
    requiredWhen: [
      'type',
      '===',
      'UnaryExpression'
    ],
    propertyOrder: 3
  },
  object: {
    type: undefined,
    $ref: '#/definitions/expression',
    title: '对象',
    requiredWhen: [
      'type',
      '===',
      'MemberExpression'
    ],
    propertyOrder: 1
  },
  property: {
    type: undefined,
    $ref: '#/definitions/expression',
    title: '属性',
    requiredWhen: [
      'type',
      '===',
      'MemberExpression'
    ],
    propertyOrder: 2
  },
  optional: {
    type: 'boolean',
    title: '可选',
    optionalWhen: [
      'type',
      'in',
      ['MemberExpression', 'CallExpression']
    ],
    propertyOrder: 3
  },
  test: {
    type: undefined,
    $ref: '#/definitions/expression',
    title: '条件',
    requiredWhen: [
      'type',
      '===',
      'ConditionalExpression'
    ],
    propertyOrder: 1
  },
  consequent: {
    type: undefined,
    $ref: '#/definitions/expression',
    title: '真值',
    requiredWhen: [
      'type',
      '===',
      'ConditionalExpression'
    ],
    propertyOrder: 2
  },
  alternate: {
    type: undefined,
    $ref: '#/definitions/expression',
    title: '假值',
    requiredWhen: [
      'type',
      '===',
      'ConditionalExpression'
    ],
    propertyOrder: 3
  },
  callee: {
    type: undefined,
    $ref: '#/definitions/expression',
    title: '函数名',
    requiredWhen: [
      'type',
      '===',
      'CallExpression'
    ],
    propertyOrder: 1
  },
  arguments: {
    type: 'array',
    title: '参数',
    items: {
      type: undefined,
      $ref: '#/definitions/expressionWithSpreadElement'
    },
    requiredWhen: [
      'type',
      '===',
      'CallExpression'
    ],
    propertyOrder: 2
  },
  elements: {
    type: 'array',
    title: '项',
    items: {
      type: undefined,
      $ref: '#/definitions/expressionWithSpreadElement'
    },
    requiredWhen: [
      'type',
      '===',
      'ArrayExpression'
    ],
    propertyOrder: 2
  },
  properties: {
    type: 'array',
    title: '属性',
    items: {
      type: undefined,
      $ref: '#/definitions/propertyWithSpreadElement',
      title: '属性项'
    },
    requiredWhen: [
      'type',
      '===',
      'ObjectExpression'
    ],
    propertyOrder: 2
  },
  params: {
    type: 'array',
    title: '参数',
    items: {
      type: undefined,
      $ref: '#/definitions/pattern'
    },
    requiredWhen: [
      'type',
      '===',
      'ArrowFunctionExpression'
    ],
    propertyOrder: 1
  },
  body: {
    type: undefined,
    $ref: '#/definitions/expression',
    title: '函数体',
    requiredWhen: [
      'type',
      '===',
      'ArrowFunctionExpression'
    ],
    propertyOrder: 1
  }
}

export const expressionEditorSchema = {
  type: undefined,
  $ref: '#/definitions/expression',
  definitions: {
    expression: {
      type: 'object',
      title: '表达式',
      properties: {
        type: {
          type: 'string',
          title: '类别',
          enum: expressionTypeEnum,
          enumTitles: expressionTypeEnumTitles,
          propertyOrder: 0
        },
        ...expressionSchema
      },
      required: [
        'type'
      ]
    },
    propertyWithSpreadElement: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          title: '类别',
          enum: [
            'Property',
            'SpreadElement'
          ],
          enumTitles: [
            '属性',
            '展开'
          ],
          propertyOrder: 0
        },
        key: {
          type: undefined,
          $ref: '#/definitions/propertyKey',
          title: '字段名称',
          requiredWhen: [
            'type',
            '===',
            'Property'
          ],
          propertyOrder: 1
        },
        value: {
          type: undefined,
          $ref: '#/definitions/expression',
          title: '值',
          requiredWhen: [
            'type',
            '===',
            'Property'
          ],
          propertyOrder: 2
        },
        shorthand: {
          type: 'boolean',
          title: '简写',
          requiredWhen: [
            'type',
            '===',
            'Property'
          ],
          propertyOrder: 3
        },
        argument: {
          type: undefined,
          $ref: '#/definitions/expression',
          title: '参数',
          requiredWhen: [
            'type',
            '===',
            'SpreadElement'
          ],
          propertyOrder: 1
        }
      },
      required: ['type']
    },
    propertyKey: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          title: '类别',
          enum: [
            'NumericLiteral',
            'StringLiteral',
            'Identifier'
          ],
          enumTitles: [
            '数字',
            '字符串',
            '标识符'
          ],
          propertyOrder: 0
        },
        stringValue: stringSchema,
        numericValue: numericSchema,
        ...identifierSchema
      },
      required: ['type']
    },
    expressionWithSpreadElement: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [...expressionTypeEnum, 'SpreadElement'],
          enumTitles: [...expressionTypeEnumTitles, '展开'],
          propertyOrder: 0
        },
        ...expressionSchema,
        spreadElementArgument: {
          type: undefined,
          $ref: '#/definitions/expression',
          propertyName: 'argument',
          requiredWhen: [
            'type',
            '===',
            'SpreadElement'
          ],
          propertyOrder: 1
        }
      },
      required: [
        'type'
      ]
    },
    pattern: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          title: '类别',
          enum: [
            'Identifier',
            'AssignmentPattern',
            'RestElement'
          ],
          enumTitles: [
            '标识符参数',
            '带默认值参数',
            '剩余参数'
          ],
          propertyOrder: 0
        },
        ...identifierSchema,
        left: {
          type: 'object',
          title: '标识符',
          properties: {
            type: {
              type: 'string',
              title: '类别',
              enum: [
                'Identifier',
              ],
              enumTitles: [
                '标识符'
              ],
              propertyOrder: 0
            },
            ...identifierSchema
          },
          requiredWhen: [
            'type',
            '===',
            'AssignmentPattern'
          ],
          propertyOrder: 1,
          required: ['type']
        },
        right: {
          type: undefined,
          $ref: '#/definitions/expression',
          title: '默认值',
          requiredWhen: [
            'type',
            '===',
            'AssignmentPattern'
          ],
          propertyOrder: 2
        },
        argument: {
          type: 'object',
          title: '参数',
          properties: {
            type: {
              type: 'string',
              enum: [
                'Identifier',
              ],
              enumTitles: [
                '标识符'
              ],
              propertyOrder: 0
            },
            ...identifierSchema
          },
          requiredWhen: [
            'type',
            '===',
            'RestElement'
          ],
          propertyOrder: 1,
          required: ['type']
        }
      },
      required: ['type']
    }
  }
}
