<template>
    <div>
         <el-table
            :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" :span-method="changeTab"
            style="width: 100%">
            <el-table-column
            label="Date"
            prop="date">
            </el-table-column>
            <el-table-column
            label="Name"
            prop="name">
            </el-table-column>
            <el-table-column
            label="address"
            prop="address">
            </el-table-column>
            <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
                <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, tableData)">Edit</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, tableData)">Delete</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="current_change"
            :total="100">
        </el-pagination>



        <!-- iview-table -->
        <Table border :columns="columns7" :data="data6"></Table>
    </div>
</template>
<script>
  export default {
    data() {
      return {
          
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        search: '',
        page: 1,

        columns7: [
            {
                title: 'Name',
                key: 'name',
                render: (h, params) => {
                    return h('div', [
                        h('Icon', {
                            props: {
                                type: 'person'
                            }
                        }),
                        h('strong', params.row.name)
                    ]);
                }
            },
            {
                title: 'Age',
                key: 'age'
            },
            {
                title: 'Address',
                key: 'address'
            },
            {
                title: 'Action',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.show(params.index)
                                }
                            }
                        }, 'View'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.remove(params.index)
                                }
                            }
                        }, 'Delete')
                    ]);
                }
            }
        ],
        data6: [
            {
                name: 'John Brown',
                age: 18,
                address: 'New York No. 1 Lake Park'
            },
            {
                name: 'Jim Green',
                age: 24,
                address: 'London No. 1 Lake Park'
            },
            {
                name: 'Joe Black',
                age: 30,
                address: 'Sydney No. 1 Lake Park'
            },
            {
                name: 'Jon Snow',
                age: 26,
                address: 'Ottawa No. 2 Lake Park'
            }
        ]
      }
    },
    methods: {
        handleEdit(index, row) {
            console.log(index, row);

        },
        handleDelete(index, row) {
            row.splice(index, 1)
            console.log(row)
            console.log(index, row);
        },
        current_change(val) {
            this.page = val;
            console.log(val)
            console.log(this.page)
        },
        show (index) {
            this.$Modal.info({
                title: 'User Info',
                content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
            })
        },
        remove (index) {
            this.data6.splice(index, 1);
        },
        changeTab ({row, index, rowIndex, columnIndex}) {
            if (rowIndex === 1 || row === 2) {
                if (columnIndex === 0) {
                    return [0, 1]
                } else if (columnIndex === 0) {
                    return [0, 0]
                }
            }
        }
    },
  }
</script>
