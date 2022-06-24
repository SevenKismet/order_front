<template>
  <div class="app-container">
    <!-- 新增品牌 对话框 -->
    <el-dialog
      title="添加品牌"
      :visible.sync="addDialogVisible"
      width="500px"
      @closed="closeAddDialog"
    >
      <el-row>
        <el-form ref="brand" :rules="brandRule" :model="brandForm" label-width="100px">
          <el-form-item prop="name" label="品牌名称：">
            <el-input v-model="brandForm.name" size="small" clearable />
          </el-form-item>
          <el-form-item prop="name" label="品牌Logo：">
            <el-upload
              class="avatar-uploader"
              :action="actionUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="brandForm.logo" :src="brandForm.logo" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
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
          width="100"
        >
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.logo">
                <img :src="scope.row.logo" alt="" class="table_img">
              </span>
              <span v-else>
                -
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="logo"
          label="合资/自主"
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
        >
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.updateTime">
                {{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
              </span>
              <span v-else>
                -
              </span>
            </div>
          </template>
        </el-table-column>
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
import { getFirstCatlog, addFirstCatlog, modifyFirstCatlog } from '@/api/catlog'
export default {
  data() {
    return {
      loading: false,
      actionUrl: '/api/uploadres',
      tableList: [],
      brandForm: {
        name: '', // 名字
        logo: '', // 图片
        type: '', // 自主-合资
        active: '', // 是否激活
        enable: '', // 是否启用
        fileList: []
      },
      typeList: [
        {
          label: '自主',
          id: 1
        },
        {
          label: '合资',
          id: 2
        }
      ],
      isEdit: false,
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
    // 确认新增/修改
    conformAddBrand() {
      this.$refs.brand.validate((valid) => {
        if (valid) {
          const data = this.brandForm
          console.log(data)
          if (this.isEdit) {
            modifyFirstCatlog(data).then((res) => {
              if (res.code === 20000) {
                this.addDialogVisible = false
                this.isEdit = false
                this.getList()
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
              }
            })
          } else {
            addFirstCatlog(data).then((res) => {
              if (res.code === 20000) {
                this.addDialogVisible = false
                this.getList()
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    closeAddDialog() {
      this.$refs.brand.resetFields()
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
      this.brandForm = JSON.parse(JSON.stringify(item))
      this.addDialogVisible = true
      this.isEdit = true
      // this.editObj = item
    },
    // logo 上传的校验
    beforeAvatarUpload(file) {
      var fileTypes = ['jpg', 'jpeg', 'png', 'gif', 'PNG', 'JPG', 'JPEG']
      const isLt2M = file.size / 1024 / 1024 < 5
      var tempFileNames = file.name.split('.')
      var fileType = tempFileNames.length ? tempFileNames[tempFileNames.length - 1] : ''
      if (!fileTypes.includes(fileType)) {
        this.$message.error('上传LOGO只能图片 格式!')
      }
      const isJPG = fileTypes.includes(fileType)
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // logo 上传
    handleAvatarSuccess(res, file) {
      if (res.code === 20000) {
        this.brandForm.logo = 'https://' + res.data
      }
      console.log(res, file)
    }
  }
}
</script>

<style scoped lang="scss">
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
.table_img{
  height: 40px;
  width: auto;
}

</style>
<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #e5e5e5;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  </style>

