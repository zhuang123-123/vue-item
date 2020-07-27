import { getDepartmentList, delDepartment, editDepartment, addDepartment } from '@/api/department'

export default {
    state: {
        // departmentList: []
    },
    mutations: {
        setDepartmentList (state, list) {
            state.departmentList = list
        }
    },
    actions: {
        /**
         * 获取部门列表（合并用户和子部门）
        */
        getDepartmentList ({commit}, data) {
            return new Promise((resolve, reject) => {
                getDepartmentList(data).then(res => {
                    const concatData = (list) => {
                        list.forEach(item => {
                            item.type = 'dep'
                            item.memberList.forEach(item => {
                                item.leaderName = item.name
                                item.name = ''
                                item.type = 'user'
                            })
                            item.child.forEach(item => {
                                item.type = 'dep'
                            })
                            itdm.children = item.memberList.concat(item.child)
                            if (item.child.length > 0) {
                                concatData(item.child)
                            }
                        })
                        return list
                    }
                    concatData(res.data.data)
                    resolve(res.data)
                })
            })
        },
        /**
         * 增加部门
        */
        addDepartment({}, data) {
            return new Promise((resolve, reject) => {
                addDepartment(data).then(res => {
                    resolve(res.data)
                })
            })
        }
    }
}