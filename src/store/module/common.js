export default {
    state: {
        departmentList: [],
        firstDepartmentList: [],
        groupList: []
    },
    mutations: {
        setDepartmentList (state, list) {
            state.departmentList = list
        },
        setFirstDepartmentList (state, list) {
            state.firstDepartmentList = list
        },
        setGroupList (state, list) {
            state.groupList = list
        }
    },
    actions: {
        /**
         * 获取部门列表
        */
    }
}