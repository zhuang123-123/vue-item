import { Modal } from 'view-design'

const beforeClose = {
    before_close_normal: (resolve) => {
        this.$Modal.confirm({
            title: '确定要关闭这一页'，
            onOk: () => {
                resolve(true)
            },
            onCancel: () => {
                resolve(false)
            }
        })
    }
}

export default beforeClose