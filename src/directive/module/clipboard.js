import Clipboard from 'clipboard'
export default {
    bind: (el, binding) => {
        const clipboard = new Clipboard(el, {
            text: () => binding.value.value
        })
        el._success_callback_ = binding.value.success
        el._error_callback_ = binding.value.error
        clipboard.on('success', e => {
            const callback = el._success_callback_
            callback && callback(e)
        })
        clipboard.on('error', e => {
            const callback = el._error_callback_
            callback && callback(e)
        })
        el._clipboard_ = clipboard
    },
    update: (el, binding) => {
        el._clipboard_.text = () => binding.value.value
        el._success_callback_ = binding.value.success
        el._error_callback_ = binding.value.error
    },
    unbind: (el, binding) => {
        delete el._success_callback_
        delete el._error_callback_
        el._clipboard_.destroy()
        delete el._clipboard_
    }
}