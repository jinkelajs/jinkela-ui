# Button

## 基本用法

```typescript
export default jkl`
  <jkl-button>Default Button</jkl-button>
  <jkl-button type="primary">Primary Button</jkl-button>
  <jkl-button disabled>Disabled Button</jkl-button>
`;
```

## 绑定点击事件

```typescript
const sleep = (ms) => new Promise((f) => setTimeout(f, ms));

const click = async (event) => {
  const { currentTarget } = event;
  currentTarget.loading = true;
  await sleep(3000);
  currentTarget.loading = false;
};

export default jkl`
  <jkl-button @click="${click}">Default Button</jkl-button>
  <jkl-button @click="${click}" type="primary">Primary Button</jkl-button>
  <jkl-button @click="${click}" disabled>Disabled Button</jkl-button>
`;
```

## 不同尺寸

```typescript
export default jkl`
  <jkl-button size="small">Small</jkl-button>
  <jkl-button size="default">Default</jkl-button>
  <jkl-button size="large">Large Button</jkl-button>
`;
```

## 圆角按钮

```typescript
export default jkl`
  <jkl-button shape="round">Round</jkl-button>
  <jkl-button shape="round" type="primary">Round</jkl-button>
`;
```

## 带图标的按钮

```typescript
export default jkl`
  <jkl-button>
    <span style="width: 1em; height: 1em; margin-right: 1ch;" slot="icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -4 108 108">
        <path
          d="M 50 0 L 6.7 75 L 93.3 75 Z"
          transform="translate(0,17)"
          stroke="currentColor"
          fill="rgba(255,255,0,.3)"
          stroke-width="8"
          stroke-linecap="round"
        />
      </svg>
    </span>
    Default Button
  </jkl-button>
`;
```

## 危险按钮

```typescript
export default jkl`
  <jkl-button danger>Default Button</jkl-button>
  <jkl-button danger type="primary">Primary Button</jkl-button>
`;
```

# Radio

## 基本用法

```typescript
export default jkl`
  <form>
    <jkl-radio name="fruit" value="apple">Apple</jkl-radio>
    <jkl-radio name="fruit" value="orange">Orange</jkl-radio>
    <hr/>
    <jkl-button role="submit">Submit</jkl-button>
  </form>
`;
```

## 禁用状态

```typescript
export default jkl`
  <form>
    <jkl-radio name="fruit" value="apple" disabled>Apple</jkl-radio>
    <jkl-radio name="fruit" value="orange" disabled>Orange</jkl-radio>
  </form>
`;
```

# Input

## 基本用法

```typescript
const input = (e) => {
  console.log(e.currentTarget);
};

export default jkl`
  <jkl-input placeholder="Basic usage" @input="${input}"></jkl-input>
`;
```

## 禁用状态

```typescript
export default jkl`
  <jkl-input placeholder="Basic usage" disabled></jkl-input>
`;
```

## 表单提交

```typescript
const submit = (e) => {
  e.preventDefault();
  alert(e.target.a.value);
};

export default jkl`
  <form @submit="${submit}">
    <jkl-input placeholder="Basic usage" name="a"></jkl-input>
    <jkl-button role="submit">Submit</jkl-button>
  </form>
`;
```
