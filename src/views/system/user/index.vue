<template>
  <div class="page-container">
    <!-- 搜索 -->
    <el-card shadow="never" class="page-search">
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
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never" class="page-content">
      <el-table :data="userList" border v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="date_joined" label="注册时间" />
      </el-table>

      <!-- 分页 -->
      <el-pagination
        style="margin-top: 20px"
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page="queryParams.page"
        :page-size="queryParams.page_size"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getUserList } from "@/api/user";

const queryParams = reactive({
  page: 1,
  page_size: 10,
  username: "",
});

const userList = ref([]);
const total = ref(0);
const loading = ref(false);

// 获取数据
const fetchList = async () => {
  loading.value = true;
  try {
    const res = await getUserList(queryParams);

    // ⚠️ 根据你的 Django 返回格式改这里
    userList.value = res.data.results;
    total.value = res.data.count;
  } finally {
    loading.value = false;
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
  console.log("页面加载了");
  fetchList();
});
</script>