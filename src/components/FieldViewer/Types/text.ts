import { type TypeFormat } from '.'

const item: TypeFormat = {
  key: 'text',
  label: 'text',
  async render(content: string) {
    return await new Promise((resolve) => {
      resolve(content)
    })
  }
}

export default item
