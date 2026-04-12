<template>
  <div class="page-container">
    <!-- ===== 详情展示 ===== -->
    <el-card>
      <template #header>
        <div class="header">
          <span>用户详情</span>
          <el-button type="primary" @click="openDrawer">编辑</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户ID">
          {{ user.user_id }}
        </el-descriptions-item>

        <el-descriptions-item label="创建时间">
          {{ formatTime(user.timestamp) }}
        </el-descriptions-item>

        <el-descriptions-item label="更新时间" class="color:red">
          <span style="color:red">{{ formatTime(user.update_time) }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="客户类型">
          {{ user.guest_type }}
        </el-descriptions-item>

        <el-descriptions-item label="桌号">
          {{ user.table_num }}
        </el-descriptions-item>

        <!-- <el-descriptions-item label="邀请公司">
          {{ user.invite_company }}
        </el-descriptions-item> -->

        <el-descriptions-item label="房间类型">
          {{ user.room_type }}
        </el-descriptions-item>

        <el-descriptions-item label="邀请码">
          {{ user.invitation_code }}
        </el-descriptions-item>

        <el-descriptions-item label="手机号">
          {{ user.mobile_number }}
        </el-descriptions-item>

        <el-descriptions-item label="姓名">
          {{ user.name }}
        </el-descriptions-item>

        <el-descriptions-item label="性别">
          {{ user.gender }}
        </el-descriptions-item>

        <el-descriptions-item label="公司">
          {{ user.company_name }}
        </el-descriptions-item>

        <el-descriptions-item label="部门">
          {{ user.department }}
        </el-descriptions-item>

        <el-descriptions-item label="职位">
          {{ user.job_title }}
        </el-descriptions-item>

        <el-descriptions-item label="邮箱">
          {{ user.email }}
        </el-descriptions-item>

        <el-descriptions-item label="到达日期">
          {{ user.arrival_date }}
        </el-descriptions-item>

        <el-descriptions-item label="到达方式">
          {{ user.arrival_transport }}
        </el-descriptions-item>

        <el-descriptions-item label="是否需要接机">
          {{ user.pickup_required }}
        </el-descriptions-item>

        <el-descriptions-item label="航班号">
          {{ user.transport_number }}
        </el-descriptions-item>

        <el-descriptions-item label="到达时间">
          <span v-if="user.arrival_hour!=null&&user.arrival_min!=null">{{ user.arrival_hour }} : {{ user.arrival_min }}</span> 
        </el-descriptions-item>

        <el-descriptions-item label="返程日期">
          {{ user.departure_date }}
        </el-descriptions-item>

        <el-descriptions-item label="返程方式">
          {{ user.departure_transport }}
        </el-descriptions-item>

        <el-descriptions-item label="是否需要送机">
          {{ user.dropoff_required }}
        </el-descriptions-item>

        <el-descriptions-item label="返程时间">
           <span v-if="user.departure_hour!=null&&user.departure_min!=null">{{ user.departure_hour }} : {{ user.departure_min }}</span> 
        </el-descriptions-item>

        <el-descriptions-item label="酒店入驻日期">
          {{ user.checkin_date }}
        </el-descriptions-item>

        <el-descriptions-item label="酒店离开日期">
          {{ user.checkout_date }}
        </el-descriptions-item>

        <el-descriptions-item label="是否参加欢迎晚宴">
          {{ user.attend_welcome_dinner }}
        </el-descriptions-item>

        <el-descriptions-item label="是否参加研计会晚宴">
          {{ user.attend_gala_dinner }}
        </el-descriptions-item>

        <el-descriptions-item label="衣服尺码">
          {{ user.cloth_size }}
        </el-descriptions-item>

        <el-descriptions-item label="备注">
          {{ user.remarks }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- <div style="margin-top: 20px">
        <el-button @click="$router.back()">返回</el-button>
      </div> -->
    </el-card>

    <!-- ===== Drawer 编辑 ===== -->
    <el-drawer
      v-model="drawerVisible"
      title="编辑用户"
      size="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="嘉宾类型" prop="guest_type">
          <el-input v-model="formData.guest_type" />
        </el-form-item>

        <el-form-item label="桌号" prop="table_num">
          <el-input-number v-model="formData.table_num" :min="1" :max="45"/>
        </el-form-item>

        <el-form-item label="房间类型">
          <el-input v-model="formData.room_type" />
        </el-form-item>

        <!-- <el-form-item label="职位">
          <el-input v-model="formData.job_title" />
        </el-form-item>

        <el-form-item label="到达日期">
          <el-date-picker
            v-model="formData.arrival_date"
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="离开日期">
          <el-date-picker
            v-model="formData.departure_date"
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="欢迎晚宴">
          <el-switch
            v-model="formData.attend_welcome_dinner"
            active-value="是 / Yes"
            inactive-value="否 / No"
          />
        </el-form-item>

        <el-form-item label="晚宴">
          <el-switch
            v-model="formData.attend_gala_dinner"
            active-value="是 / Yes"
            inactive-value="否 / No"
          />
        </el-form-item> -->
      </el-form>

      <template #footer>
        <div class="footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getUserDetail, updateUser } from "@/api/user";

const route = useRoute();

// 时间戳转时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);

  return date.toLocaleString();
};

const user = ref({});
const formData = ref({
  user_id: '',
  guest_type: '',
  table_num: null,
  room_type: ''
});
const oldData = ref({
  guest_type: '',
  table_num: null,
  room_type: ''
});
const drawerVisible = ref(false);
const formRef = ref();

// 表单校验
// const rules = {
//   name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
//   mobile_number: [
//     { required: true, message: "请输入手机号", trigger: "blur" },
//   ],
// };

// 获取详情
const fetchDetail = async () => {
  const user_id = route.params.id;
  const res = await getUserDetail({user_id: user_id});
  console.log("获取到的用户详情为：", res);
  if (0 == res.errcode) {
    user.value = res.data.user_info;
  } else {
    // undo
    console.log(res.errmsg);
    ElMessage.error("网络错误，请稍后再试");
  }

};

// 打开 Drawer
const openDrawer = () => {
  // 存储信息，用于对比
  // Object.assign(formData, user.value);
  oldData.value.guest_type = user.value.guest_type;
  oldData.value.table_num = user.value.table_num;
  oldData.value.room_type = user.value.room_type;
  // 填充信息
  formData.value.guest_type = user.value.guest_type;
  formData.value.table_num = user.value.table_num;
  formData.value.room_type = user.value.room_type;

  drawerVisible.value = true;
};

const isChanged = () => {
  return (
    oldData.value.guest_type !== formData.value.guest_type ||
    oldData.value.table_num !== formData.value.table_num ||
    oldData.value.room_type !== formData.value.room_type
  );
};

// 关闭确认
const handleClose = (done) => {
  if (isChanged()) {
    if (confirm("有未保存修改，确定关闭吗？")) {
      done();
    }
  } else {
    done();
  }
};

// 保存
const handleSave = async () => {
  // await formRef.value.validate();
  formData.value.user_id = user.value.user_id;

  const res = await updateUser(formData.value);
  console.log("更新后的结果为：", res);
  if (0 == res.errcode) {
    user.value = res.data.user_info;
  } else {
    console.log(res.errmsg);
    ElMessage.error("网络错误，请稍后再试");
  }

  // user.value = { ...formData };

  drawerVisible.value = false;

  ElMessage.success("保存成功");
};

onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer {
  text-align: right;
}
</style>

