<template>
  <div class="page-container">
    <!-- 搜索 -->
    <!-- <el-card shadow="never" class="page-search">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="用户名">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card> -->

    <!-- 导出Excel -->
    <!-- <div style="margin-bottom: 10px;">
      <el-button type="primary" @click="exportExcel">
        导出 Excel
      </el-button>
    </div> -->

    <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 20px;">
    
    <el-button
      type="primary"
      :loading="exporting"
      :disabled="exporting"
      @click="exportExcel"
    >
      导出 Excel
    </el-button>

  </div>

    <!-- 表格 -->
    <el-card shadow="never" class="page-content">
      <el-table :data="companyList" border v-loading="loading" style="width:100%" table-layout="auto" >
        <el-table-column type="index" label="序号" width="60" header-align="center" align="center" />
        <el-table-column prop="company_id" label="公司ID" width="120" header-align="center" align="center" />
        <el-table-column prop="company_name" label="公司名称"  width="300" header-align="center" />
        <el-table-column prop="invitation_code" label="邀请码"  width="100" header-align="center" align="center" />
        <el-table-column prop="max_num" label="最大邀请数"  width="100" header-align="center" align="center" />
        <el-table-column prop="register_sum" label="已注册人数"  width="100" header-align="center" align="center" />
        <el-table-column prop="note" label="备注"  min-width="300" header-align="center" />
       
      </el-table>

      <!-- 分页 -->
      <!-- <el-pagination
        style="margin-top: 20px"
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page="queryParams.page"
        :page-size="queryParams.page_size"
        @current-change="handlePageChange"
      /> -->
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getCompanyList } from "@/api/company";

// 导出Excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'


// 获取时间并格式化为中文
const getNowTimeStringCN = () => {
  const now = new Date();

  const Y = now.getFullYear();
  const M = String(now.getMonth() + 1).padStart(2, "0");
  const D = String(now.getDate()).padStart(2, "0");

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  return `${Y}年${M}月${D}日_${h}时${m}分${s}秒`;
};

const queryParams = reactive({
  page: 1,
  page_size: 10,
  username: "",
});

const companyList = ref([]);
const loading = ref(false);

// 获取数据
const fetchList = async () => {
  loading.value = true;
  try {
    const res = await getCompanyList(queryParams);
    console.log("获取的用户列表：", res);
    if (res.errcode == 0) {
      companyList.value = res.data.company_list || [];
    }

  } finally {
    loading.value = false;
  }
};

// excel导出函数
let exporting = ref(false);
let lastClickTime = 0;
const exportExcel = async () => {
  const now = Date.now();
  // 防抖，1秒内不允许再次点击
  if (now - lastClickTime < 1000) {
    return;
  }
  lastClickTime = now;

  // 状态锁
  if (exporting.value) {
    ElMessage.warning("正在导出，请勿重复点击");
    return;
  }
  exporting.value = true;

  try {
    ElMessage.info("正在导出，请稍候..");
    // 1. 处理数据（转成你想要的字段）
    const data = companyList.value.map((item, index) => ({
      序号: index + 1,
      公司ID: item.company_id,
      公司名称: item.company_name,
      邀请码: item.invitation_code,
      最大邀请数: item.max_num,
      已注册人数: item.register_sum,
      备注: item.note,
    }));

    // 2. 转 worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    // 设置列距离
    worksheet['!cols'] = [
      { wch: 4 },   // 序号
      { wch: 12 },  // 公司ID
      { wch: 50 },  // 公司名称
      { wch: 8 },  // 邀请码
      { wch: 12 },  // 最大邀请数
      { wch: 12 },  // 已注册人数
      { wch: 30 },  // 备注
    ];

    // 3. 创建 workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "用户列表");

    // 4. 导出文件
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    // saveAs(blob, "用户列表.xlsx");
    saveAs(blob, `用户列表导出_${getNowTimeStringCN()}.xlsx`);
    ElMessage.success("导出成功");
  } catch(e) {
    ElMessage.error("导出失败");
  }finally {
    exporting.value = false;
  }
  
};

// 搜索
const handleQuery = () => {
  queryParams.page = 1;
  fetchList();
};

// 重置
const handleResetQuery = () => {
  queryParams.username = "";
  queryParams.page = 1;
  fetchList();
};

// 分页
const handlePageChange = (page) => {
  queryParams.page = page;
  fetchList();
};



onMounted(() => {
  fetchList();
});





</script>