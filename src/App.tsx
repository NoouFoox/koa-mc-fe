import { Button, Modal, Spin, Table, Upload, UploadProps, message } from "antd";
import http from "./http/http";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function App() {
  const props: UploadProps = {
    name: "file",
    maxCount: 1,
    action: import.meta.env.VITE_API_HOST + "/we" + "/upload",
    headers: {
      authorization: "authorization-text",
    },
    data: {
      slat: import.meta.env.VITE_API_SLAT,
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} 上传成功`);
        info.fileList.length = 0;
        loadData();
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 上传成功失败`);
      }
    },
  };
  const columns: any = [
    {
      title: "文件名称",
      width: 500,
      ellipsis: true,
      dataIndex: "name",
      key: "name",
    },
    {
      title: "最后修改时间",
      dataIndex: "time",
      key: "time",
      render: (_: null, { stats: { atime } }: { stats: { atime: string } }) => (
        <>{atime && dayjs(atime).format("YYYY-MM-DD HH:mm:ss")}</>
      ),
    },
    {
      title: "操作",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_: null, { name }: { name: string }) => (
        <>
          <Button
            type="link"
            href={`${import.meta.env.VITE_API_HOST}\\static\\${name}`}
            target="_blank"
          >
            下载
          </Button>
          <Button type="link" danger>
            删除
          </Button>
        </>
      ),
    },
  ];
  const [list, setList] = useState([]);
  const [loading, stLoading] = useState(false);
  const loadData = () => {
    stLoading(true);
    http({ url: "/we", data: {}, method: "get" })
      .then((res) => {
        setList(res.data);
      })
      .finally(() => stLoading(false));
  };
  useEffect(() => {
    loadData();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <main className="">
      <Button className="m-2" onClick={() => showModal()}>
        上传
      </Button>
      <Spin spinning={loading}>
        <Table
          className="m-1"
          columns={columns}
          dataSource={list}
          rowKey="name"
        ></Table>
      </Spin>
      <Modal
        title="上传文件"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>
      </Modal>
    </main>
  );
}

export default App;
