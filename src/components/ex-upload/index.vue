<template>
  <BaseFlexBox type="inline-flex" gap="5px">
    <el-upload
      v-if="action"
      ref="uploadFile"
      :disabled="disabled || uploading"
      :action="YSSQP + action"
      :file-list="fileList"
      :data="{accessToken,...data}"
      :multiple="multiple"
      :limit="limit"
      :on-success="uploadSuccess"
      :show-file-list="false"
      :auto-upload="autoUpload"
      :before-upload="uploadBefore"
      accept=".jpg,.jpeg,.png"
    >
      <i class="el-icon-camera" style="font-size: 20px;padding: 20px;background:#f0f0f1;color:#409EFF" :style="{padding: plusPx / 2 + 'px',cursor:disabled ? 'not-allowed':'pointer'}"></i>
    </el-upload>
    <BaseFlexBox class="el-upload-list el-upload-list--picture-card" gap="5px" wrap="wrap" style="flex: 1" v-if="fileList!==null&&fileList.length>0">
      <li v-for="(ite,index) in fileList" :key="index" class="el-upload-list__item is-ready" style="margin: 0;width:62px;height: 62px;" :style="{ width: (plusPx + 22)+ 'px',height: (plusPx + 22)+ 'px'}">
        <el-image class="el-upload-list__item-thumbnail" :src="YSSQP+'/'+ite" alt="" @click="clickHandler" />
        <span class="el-upload-list__item-actions" @click="preShowPicture(ite, index)">
          <span class="el-upload-list__item-preview" @click.stop="preShowPicture(ite, index)">
            <i class="el-icon-zoom-in" />
          </span>
          <span v-if="!uploading&&!disabled" class="el-upload-list__item-delete" style="margin-left: 0" @click.stop="handleRemove(index)">
            <i class="el-icon-delete" />
          </span>
        </span>
      </li>
    </BaseFlexBox>
    <template v-if="preview">
      <ImageViewer v-if="previewVisible" :z-index="3000" :base-url="baseUrl + '/'" :infiniteLoop="false" :initial-index="imageIndex" :url-list="allFileList || fileList" :on-close="closeViewer" />
    </template>
  </BaseFlexBox>
</template>
<script>
import ImageViewer from "./preview.vue";
import { getToken } from "@/utils/auth";
export default {
  components: {
    ImageViewer
  },
  model: {
    prop: "src",
    event: "change"
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return { };
      }
    },
    src: {
      type: String,
      default: "",
      required: true
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    action: {
      type: String,
      default: ""
    },
    baseUrl: {
      type: String,
      default: ""
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ".jpg,.jpeg,.png"
    },
    limit: {
      type: Number,
      default: 5
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ""
    },
    beforeEmitData: {
      type: Function,
      default: (res, file, type) => {
        if (res.code == 200) {
          if (res.data.Result) {
            return res.data.Data;
          } else {
            return res.data[0];
          }
        } else {
          return false;
        }
      }
    },
    // 当前图片在图片库中预览
    allFileList: {
      type: Array
    }
  },
  data() {
    return {
      accessToken: getToken(),
      YSSQP: this.baseUrl,
      // upload: {
      //   data: { accessToken: getToken() },
      //   limit: 5,
      //   accept: ".jpg,.png,.pdf",
      //   multiple: false
      // },
      previewVisible: false,
      uploading: false,
      imageUrl: "",
      fileList: [],
      imageIndex: 0
    };
  },
  computed: {
    preview() {
      const { fileList } = this;
      return Array.isArray(fileList) && fileList.length > 0;
    },
    plusPx() {
      const _size = this.size == "big" ? 100 : 20;
      return 2 * _size;
    }
  },
  watch: {
    src: {
      immediate: true,
      deep: true,
      handler(v) {
        if (v) {
          this.fileList = v.split(",");
        } else {
          this.fileList = [];
        }
      }
    }
  },
  methods: {
    clickHandler() {
      if (!this.preview) {
        return;
      }
      this.previewVisible = true;
    },
    closeViewer() {
      this.previewVisible = false;
    },
    preShowPicture(url, ind) {
      if (!this.allFileList || this.allFileList.length == 0) {
        this.imageIndex = ind;
      } else {
        const imgInd = this.allFileList.findIndex(src => src == url);
        if (imgInd > -1) {
          this.imageIndex = imgInd;
        } else {
          this.imageIndex = ind;
        }
      }
      if (url.indexOf(".pdf") > -1) {
        window.open(url, "_blank");
      } else {
        this.imageUrl = this.baseUrl + "/" + url;
        this.previewVisible = true;
      }
    },
    handleRemove(index, type) {
      try {
        this.fileList.splice(index, 1);
        this.$emit("change", this.fileList.join(","));
      } catch (error) {
        console.log(error);
      }
    },
    getPathName(v) {
      return v.split("/").pop().split(".")[0];
    },
    uploadBefore(file, type) {
      console.log(file);
      const isJPG = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png" || file.type === "application/pdf";
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isJPG) {
        this.$message.error("上传图片只能是jpg,jpeg,png,pdf格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过50MB!");
      }
      return isJPG && isLt2M;
    },
    // 上传文件
    uploadSuccess(res, file, type) {
      const _data = this.beforeEmitData(res, file, type);
      if (_data) {
        this.fileList.push(_data);
        this.$emit("change", this.fileList.join(","));
        this.$message({
          message: "上传成功",
          center: true,
          type: "success"
        });
        return res.data[0];
      } else {
        this.$message({
          message: "上传失败",
          center: true,
          type: "error"
        });
      }
    }
  }
};
</script>
