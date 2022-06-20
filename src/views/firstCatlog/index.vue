<template>
  <div class="app-container">
    <!-- 新增品牌 对话框 -->
    <el-dialog
      title="添加品牌"
      :visible.sync="addDialogVisible"
      width="500px"
    >
      <el-row>
        <el-form ref="brand" :rules="brandRule" :model="brandForm" label-width="100px">
          <el-form-item prop="name" label="品牌名称：">
            <el-input v-model="brandForm.name" size="small" clearable />
          </el-form-item>
          <el-form-item prop="type" label="类型：">
            <el-radio-group v-model="brandForm.type">
              <el-radio v-for="(item,index) in typeList" :key="index" :label="item.id">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="conformAddBrand">确 定</el-button>
      </span>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="品牌名称：">
            <el-input v-model="form.name" size="small" clearable @keyup.enter.native="serachList()" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-button style="marginTop:4px;" size="small" @click="serachList">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-button size="small" type="primary" @click="addBrand">新增品牌</el-button>
    </el-row>
    <el-row v-loading="loading" class="table_content">
      <el-table
        border
        :data="tableList"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="品牌名称"
          width="180"
        />
        <el-table-column
          prop="logo"
          label="品牌LOGO"
          width="180"
        />
        <el-table-column
          prop="logo"
          label="合资/国产"
          width="190"
          :formatter="formateType"
        />
        <el-table-column
          prop="date"
          label="创建日期"
          width="180"
        />
        <el-table-column
          prop="date"
          label="最后修改日期"
          width="180"
        />
        <el-table-column
          prop="name"
          label="激活"
          width="180"
        />
        <el-table-column
          prop="address"
          label="操作"
          min-width="100"
        >
          <template slot-scope="scope">
            <div>
              <el-button type="warning" size="mini" @click="handleDelete(scope.row)">删除</el-button>
              <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="page_content">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :current-page="pageNumber"
        @current-change="changePage"
      />
    </el-row>
  </div>
</template>

<script>
import { getFirstCatlog, addFirstCatlog } from '@/api/catlog'
export default {
  data() {
    return {
      loading: false,
      tableList: [],
      brandForm: {
        name: '', // 名字
        logo: '', // 图片
        type: '', // 国产-合资
        active: '', // 是否激活
        enable: '' // 是否启用
      },
      typeList: [
        {
          label: '国产',
          id: 1
        },
        {
          label: '合资',
          id: 2
        }
      ],
      addDialogVisible: false,
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      brandRule: {
        name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 格式化类型
    formateType(item) {
      const types = item.type
      const result = this.typeList.find((item) => {
        return item.id === types
      })
      return result.label
    },
    // 新增品牌
    addBrand() {
      this.addDialogVisible = true
    },
    // 确认新增
    conformAddBrand() {
      this.$refs.brand.validate((valid) => {
        if (valid) {
          const data = this.brandForm
          console.log(data)
          addFirstCatlog(data).then((res) => {
            if (res.code === 20000) {
              this.getList()
              this.$message({
                message: '新增成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    serachList() {
      this.getList()
    },
    // 查询列表
    getList() {
      const data = {
        name: this.form.name,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      this.loading = true
      getFirstCatlog(data).then((res) => {
        this.loading = false
        if (res.code === 20000) {
          const datas = res.data
          this.tableList = datas.rows
          this.total = datas.total
        }
      })
    },
    // 修改分页
    changePage(val) {
      this.pageNumber = val
      this.getList()
    },
    handleDelete(item) {
      console.log(item)
    },
    handleEdit(item) {
      console.log(item)
    }
  }
}
</script>

<style scoped>
.table_content{
  margin-top: 10px;
}
.page_content{
  text-align: center;
  margin-top: 10px;
}
.line{
  text-align: center;
}
</style>

