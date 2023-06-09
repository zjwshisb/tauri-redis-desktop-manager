
import { type TypeFormat } from '.'

const item: TypeFormat = {
    key: 'text',
    label: 'text',
    format(content: string) {
       return content
    }
}

export default item
