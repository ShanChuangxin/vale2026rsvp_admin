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

    <!-- 今日新增 -->
    <span style="color: #67C23A; font-weight: 500;">
      今日新增：{{ todayNewCount }}
    </span>

    <!-- 今日更新 -->
    <span style="color: #E6A23C; font-weight: 500;">
      今日更新：{{ todayUpdateCount }}
    </span>

  </div>

    <!-- 表格 -->
    <el-card shadow="never" class="page-content">
      <el-table :data="userList" border v-loading="loading" style="width:100%" table-layout="auto" @row-click="goDetail" >
        <el-table-column type="index" label="序号" width="60" header-align="center" align="center" />
        <el-table-column prop="user_id" label="用户ID" width="20" header-align="center" />
        <el-table-column label="创建时间" width="180" header-align="center">
          <template #default="{ row }">
            {{ formatTime(row.timestamp) }}
          </template>
        </el-table-column>  
        <el-table-column label="更新时间" width="180" header-align="center">
          <template #default="{ row }">
            <!-- <span style="color: red">
              {{ formatTime(row.update_time) }}
            </span> -->
            {{ formatTime(row.update_time) }}
          </template>
        </el-table-column>  
        <!-- <el-table-column prop="guest_type" label="会员类型" width="90" /> -->
        <el-table-column prop="table_num" label="桌号" width="60" header-align="center" align="center" />
        <!-- <el-table-column prop="room_type" label="房号" width="60" /> -->
        <!-- <el-table-column prop="invitation_code" label="公司邀请码" width="100" /> -->
        <el-table-column prop="name" label="姓名"  width="100" header-align="center" />
        <el-table-column prop="gender" label="性别" width="100" header-align="center" align="center" />
        <el-table-column prop="mobile_number" label="手机号" width="120" header-align="center" />
        <el-table-column prop="company_name" label="公司名称" min-width="200" header-align="center" />
        <!-- <el-table-column prop="department" label="部门"  width="120"/>
        <el-table-column prop="job_title" label="职位" width="120" />
        <el-table-column prop="email" label="邮箱"  width="120"/>
        <el-table-column prop="arrival_date" label="抵达日期" width="100"  />
        <el-table-column prop="arrival_transport" label="抵达交通方式" width="120"/>
        <el-table-column prop="pickup_required" label="是否需要接机" min-width="310" />
        <el-table-column prop="transport_number" label="航班号"  />
        <el-table-column prop="arrival_hour" label="到达小时"  />
        <el-table-column prop="arrival_min" label="到达分钟"  />
        <el-table-column prop="departure_date" label="返程日期"  />
        <el-table-column prop="departure_transport" label="返程方式"  />
        <el-table-column prop="dropoff_required" label="是否需要送机"  />
        <el-table-column prop="departure_hour" label="返程小时" />
        <el-table-column prop="departure_min" label="返程分钟"  />
        <el-table-column prop="checkin_date" label="酒店入住日期"  />
        <el-table-column prop="checkout_date" label="离店日期"  />
        <el-table-column prop="attend_welcome_dinner" label="参加欢迎晚宴" />
        <el-table-column prop="attend_gala_dinner" label="参加会谈晚宴" />
        <el-table-column prop="cloth_size" label="衣服尺码" />
        <el-table-column prop="remarks" label="备注" /> -->
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
import { getUserList } from "@/api/user";
import { useRouter } from "vue-router";

// 导出Excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'

// 时间戳转时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);

  return date.toLocaleString();
};
// 格式化处理时间和分
const formatTimeHM = (hKey, mKey) => {
  const hour = hKey;
  const min = mKey;

  if (hour == null || min == null) return "";

  return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};
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

const userList = ref([]);
const loading = ref(false);

// 获取数据
const fetchList = async () => {
  loading.value = true;
  try {
    const res = await getUserList(queryParams);
    console.log("获取的用户列表：", res);
    if (res.errcode == 0) {
      userList.value = res.data.user_list || [];
    }
    // 数据统计
    calcTodayStats();

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
    const data = userList.value.map((item, index) => ({
      序号: index + 1,
      用户ID: item.user_id,
      创建时间: formatTime(item.timestamp),
      更新时间: formatTime(item.update_time),
      嘉宾类型: item.guest_type,
      桌号: item.table_num,
      房型: item.room_type,
      邀请码: item.invitation_code,
      手机号: item.mobile_number,
      姓名: item.name,
      性别: item.gender,
      公司名称: item.company_name,
      部门: item.deparment,
      职位: item.job_title,
      邮箱: item.email,
      抵达日期: item.arrival_date,
      抵达方式: item.arrival_transport,
      是否需要接机: item.pickup_required,
      航班号: item.transport_number,
      抵达时间: formatTimeHM(item.arrival_hour, item.arrival_min),
      返程日期: item.departure_date,
      返程方式: item.departure_transport,
      是否需要送机: item.dropoff_required,
      返程时间: formatTimeHM(item.departure_hour, item.departure_min),
      酒店入住日期: item.checkin_date,
      酒店退房日期: item.checkout_date,
      是否参加欢迎晚宴: item.attend_welcome_dinner,
      是否参加研讨会晚宴: item.attend_gala_dinner,
      衣服尺码: item.cloth_size,
      备注: item.remarks
    }));

    // 2. 转 worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

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

// 计算今天新增的用户和今天新更新数据的用户
const todayNewCount = ref(0);
const todayUpdateCount = ref(0);
// 计算今天
const isToday = (timestamp) => {
  if (!timestamp) return false;

  const date = new Date(timestamp * 1000);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};
// 计算数量
const calcTodayStats = () => {
  let newCount = 0;
  let updateCount = 0;

  userList.value.forEach((item) => {
    // 今日新增
    if (isToday(item.timestamp)) {
      newCount++;
    }

    // 今日更新（注意避免和新增重复统计）
    if (
      isToday(item.update_time) &&
      item.update_time !== item.timestamp
    ) {
      updateCount++;
    }
  });

  todayNewCount.value = newCount;
  todayUpdateCount.value = updateCount;
};

onMounted(() => {
  fetchList();
});



const router = useRouter();

const goDetail = (row) => {
  console.log("当前的用户id：", row.user_id);
  router.push(`/user/detail/${row.user_id}`);
};

</script>