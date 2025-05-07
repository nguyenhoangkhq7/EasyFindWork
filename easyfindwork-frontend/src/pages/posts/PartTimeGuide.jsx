import React from "react";
import { Typography, List, Card, Image, Button } from "antd";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const PartTimeGuide = () => {
  const jobs = [
    {
      id: 1,
      title: "Gia sư part time",
      description:
        "Gia sư part time là công việc được nhiều bạn sinh viên sư phạm hoặc ngoại ngữ ưa chuộng. Công việc tương đối nhẹ nhàng, thời gian dạy kèm thường là buổi tối, hình thức dạy online hay tại nhà còn phụ thuộc vào thoả thuận với phụ huynh và học sinh. Gia sư part time thường dạy 6 – 8 tiếng trong tuần. Mức lương công việc này dao động từ 100.000 – 200.000 đồng/giờ.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
    {
      id: 2,
      title: "Cộng tác viên làm đồ thủ công",
      description:
        "Nhiều công ty kinh doanh đồ handmade, phụ kiện tuyển nhân viên part time làm đồ thủ công. Bạn phải khéo tay, tỉ mỉ và cẩn thận để hoàn thành sản phẩm theo yêu cầu. Mức lương của công việc này phụ thuộc vào năng suất làm việc, dao động từ 1 – 2 triệu đồng/tháng.",
      image: "https://images.unsplash.com/photo-1600585154347-be6161a56a0c",
    },
    {
      id: 3,
      title: "Tài xế công nghệ",
      description:
        "Hiện nay, nhiều hãng xe công nghệ như Grab, Gojek, Be, Xanh SM,… hoặc các nền tảng thương mại điện tử như Shopee, Lazada, Tiki,… tuyển tài xế part time chuyên chở khách hoặc giao hàng. Thời gian làm việc linh hoạt, mức lương tài xế công nghệ dao động từ 8000 – 10000 đồng/km, tuỳ vào nền tảng xe công nghệ.",
      image: "https://images.unsplash.com/photo-1600585154347-be6161a56a0c",
    },
    {
      id: 4,
      title: "Nhân viên bán hàng part HOLIDAY time",
      description:
        "Nhân viên bán hàng là người có trách nhiệm đón tiếp, gợi ý, tư vấn các sản phẩm/dịch vụ phù hợp với nhu cầu của khách hàng. Họ còn sắp xếp, trưng bày và bảo quản hàng hoá cũng như giải đáp các thắc mắc của khách hàng. Thời gian làm việc từ 4 – 5 tiếng/ca, đa số lịch làm việc bao gồm các ngày cuối tuần và ngày lễ, Tết. Mức lương nhân viên bán hàng part time dao động từ 20.000 – 30.000 đồng/giờ.",
      image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df",
    },
    {
      id: 5,
      title: "Nhân viên phục vụ part time",
      description:
        "Nhân viên phục vụ thường làm việc tại các quán cà phê, nhà hàng, quán ăn,… Công việc chính của nhân viên phục vụ part time là đón tiếp, order món và cung cấp đồ ăn/thức uống theo yêu cầu của khách hàng. Thời gian làm việc từ 4 – 5 tiếng/ca, đa số lịch làm việc bao gồm các ngày cuối tuần và ngày lễ, Tết. Mức lương nhân viên phục vụ part time từ 20.000 – 30.000 đồng/giờ.",
      image: "https://images.unsplash.com/photo-1592861956120-e524fc739696",
    },
    {
      id: 6,
      title: "Nhân viên nhập liệu part time",
      description:
        "Công việc của nhân viên nhập liệu hay nhân viên đánh máy part time là nhập liệu, rà soát lỗi sai, xác minh, cập nhật và chỉnh sửa dữ liệu. Công việc này khá đơn giản, bạn chỉ cần cẩn thận, tỉ mỉ nhập liệu chính xác. Mức lương nhân viên nhập liệu part time dao động từ 1 – 4 triệu đồng/tháng.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
    {
      id: 7,
      title: "Cộng tác viên viết bài",
      description:
        "Công việc của cộng tác viên viết bài là viết lách theo yêu cầu như bài SEO, bài PR cho báo, bài viết social,… Đây là công việc part time được nhiều bạn trẻ ưa chuộng, mang lại nguồn thu nhập tương đối ổn định. Mức lương cộng tác viên viết bài dao động từ 50.000 – 500.000 đồng/bài viết.",
      image: "https://images.unsplash.com/photo-1455390582262-044c498ce311",
    },
    {
      id: 8,
      title: "Cộng tác viên thiết kế",
      description:
        "Đây là công việc part time tuyệt vời cho những ai có khả năng sử dụng thành thạo các phần mềm thiết kế. Dựa theo yêu cầu của công ty tuyển dụng, các bạn có thể thiết kế banner, poster quảng cáo, hình ảnh trên các trang social,… Mức lương cộng tác viên thiết kế dao động từ 50.000 – 400.000 đồng/sản phẩm.",
      image: "https://images.unsplash.com/photo-1600585154347-be6161a56a0c",
      link: "/jobs/design",
    },
    {
      id: 9,
      title: "Nhân viên trực page",
      description:
        "Công việc của nhân viên trực page theo dõi và quản lý các hoạt động trên mạng xã hội của công ty hoặc cửa hàng. Cụ thể thì nhân viên trực page là người tư vấn, báo giá, chốt đơn hàng, kiểm soát phản hồi,… khi có khách nhắn tin cho fanpage. Thời gian làm việc của nhân viên trực page part time từ 4 – 5 tiếng/ngày, mức lương dao động từ 2 – 4 triệu đồng/tháng.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      link: "/jobs/direct-page",
    },
    {
      id: 10,
      title: "Nhân viên telesales part time",
      description:
        "Nhân viên telesales hay nhân viên chăm sóc khách hàng là công việc part time được nhiều bạn sinh viên ưa chuộng. Công việc chủ yếu là trực tổng đài, giải đáp thắc mắc, khiếu nại và tư vấn sản phẩm/dịch vụ. Một số công việc còn yêu cầu nhân viên telesales chào bán sản phẩm/dịch vụ theo data được cung cấp. Mức lương dao động từ 2 – 4 triệu đồng, kèm hoa hồng nếu có.",
      image: "https://images.unsplash.com/photo-1596524430610-40125146e3c2",
      link: "/jobs/telesales",
    },
    {
      id: 11,
      title: "Nhân viên bảo vệ part time",
      description:
        "Nhân viên bảo vệ là công việc phù hợp với phái nam, công việc này chủ yếu là quản lý, giám sát tình hình an ninh và trông coi tài sản tại công ty hoặc nhà hàng, quán ăn, cửa hàng,… Thời gian làm việc theo ca. Công việc này thường phải làm vào cuối tuần và ngày lễ, Tết. Mức lương của nhân viên bảo vệ part time dao động từ 3 – 5 triệu đồng/tháng.",
      image: "https://images.unsplash.com/photo-1596524430610-40125146e3c2",
      link: "/jobs/security",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="shadow-lg rounded-lg p-6 bg-white">
            <Title level={2} className="text-blue-600 font-bold text-center">
              Nhân Viên Part Time Là Gì? 11 Công Việc Part Time Lương Cao
            </Title>
            <Text className="block text-gray-500 text-center mb-4">
              Bởi Thuyen Dang • 2 tháng trước
            </Text>
            <Paragraph className="text-gray-600 text-center">
              Chia sẻ bài viết này
            </Paragraph>
            <Paragraph className="text-gray-700 leading-relaxed">
              Hiện nay, nhu cầu tuyển dụng nhân viên part time ngày càng tăng
              cao, đặc biệt phù hợp các bạn sinh viên muốn làm việc linh hoạt và
              kiếm thêm thu nhập. Vậy nhân viên part time là gì? Tuyển nhân viên
              part time có yêu cầu gì? Mức lương nhân viên part time ra sao? Nếu
              bạn đang quan tâm những vấn đề này thì bài viết dưới đây của Nghề
              Nghiệp Việc Làm 24h chắc chắn dành cho bạn!
            </Paragraph>
            <Button
              type="primary"
              className="bg-blue-500 hover:bg-blue-600 mt-4 w-full sm:w-auto"
            >
              <Link to="/jobs">TÌM VIỆC PART TIME TẠI ĐÂY</Link>
            </Button>

            <Title level={3} className="text-blue-500 mt-6">
              Nhân viên part time là gì?
            </Title>
            <Paragraph className="text-gray-700">
              Nhân viên part time là những người làm việc được trả lương theo
              giờ. Tính chất công việc thường đơn giản, không yêu cầu chuyên môn
              cao. Thời gian làm việc part time dựa vào nhu cầu và thỏa thuận
              giữa người lao động và người sử dụng lao động. Thay vì làm việc đủ
              8 tiếng/ngày và 5 ngày/tuần, thời gian làm việc của nhân viên part
              time thường ngắn hơn.
            </Paragraph>
            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              alt="Part Time Intro"
              className="rounded-lg w-full h-64 object-cover my-4"
            />

            <Title level={3} className="text-blue-500 mt-6">
              Mức lương tối thiểu là bao nhiêu?
            </Title>
            <Paragraph className="text-gray-700">
              Mức lương trung bình của nhân viên part time chịu ảnh hưởng theo
              quy định về mức lương tối thiểu vùng. Theo quy định tại Điều 3
              Nghị định 38/2022/NĐ-CP: Mức lương tối thiểu ở các khu vực thuộc
              vùng I là 22.500 đồng/giờ, vùng II là 20.000 đồng/giờ, vùng III là
              17.500 đồng/giờ và vùng IV là 15.600 đồng/giờ.
            </Paragraph>

            <Title level={3} className="text-blue-500 mt-6">
              Cách tính lương nhân viên part time
            </Title>
            <Paragraph className="text-gray-700">
              Cách tính lương thường được quy định rõ ràng thông qua phỏng vấn
              và mô tả công việc. Hiện nay, có 4 cách tính lương phổ biến:
            </Paragraph>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                <strong>Tính lương theo giờ:</strong> Lấy tiền lương của một giờ
                làm việc nhân với thời gian làm việc.
              </li>
              <li>
                <strong>Tính lương theo ca:</strong> Mức tính lương theo ca có
                thể cao hơn, tùy vào tính chất công việc.
              </li>
              <li>
                <strong>Tính lương theo tháng:</strong> Yêu cầu đi làm đủ số
                buổi để nhận lương.
              </li>
              <li>
                <strong>Tính lương theo KPI:</strong> Hoàn thành KPI về số lượng
                sản phẩm để nhận lương.
              </li>
            </ul>
            <Paragraph className="text-gray-700 font-semibold">
              Lưu ý:
            </Paragraph>
            <Paragraph className="text-gray-700">
              Một số ngành nghề yêu cầu làm việc đêm hoặc cuối tuần, ngày lễ.
              Lương làm việc trong những ngày này thường cao hơn:
            </Paragraph>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Làm ca đêm: Tối thiểu 30% tiền lương cơ bản.</li>
              <li>Làm thêm giờ: Lương cao hơn 130% so với ca hành chính.</li>
              <li>Làm cuối tuần: Lương cao hơn 200% so với ngày thường.</li>
              <li>Làm lễ, Tết: Lương cao hơn 300% so với ngày thường.</li>
            </ul>
            <Paragraph className="text-gray-700">
              Bộ Luật lao động quy định: Lương giờ, ngày, tuần được trả sau giờ,
              ngày, tuần làm việc hoặc trả gộp ít nhất 15 ngày/lần.
            </Paragraph>
            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              alt="Payroll Calculation"
              className="rounded-lg w-full h-64 object-cover my-4"
            />

            <Title level={3} className="text-blue-500 mt-6">
              Các vị trí tuyển nhân viên part time phổ biến
            </Title>
            <List
              grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2 }}
              dataSource={jobs}
              renderItem={(item) => (
                <List.Item>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card
                      className="shadow-md hover:shadow-lg transition-shadow duration-300"
                      title={
                        <span className="text-lg font-semibold text-blue-600">{`${item.id}. ${item.title}`}</span>
                      }
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="rounded-lg w-full h-48 object-cover mb-4"
                      />
                      <Paragraph className="text-gray-600">
                        {item.description}
                      </Paragraph>
                      {item.link && (
                        <Button
                          type="primary"
                          className="bg-blue-500 hover:bg-blue-600 mt-4 w-full"
                        >
                          <Link to={item.link}>
                            TÌM VIỆC {item.title.toUpperCase()} TẠI ĐÂY
                          </Link>
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                </List.Item>
              )}
            />

            <Title level={3} className="text-blue-500 mt-6">
              Kết luận
            </Title>
            <Paragraph className="text-gray-700">
              Vị trí nhân viên part time phù hợp với những bạn muốn kiếm thêm
              thu nhập nhưng vẫn linh hoạt thời gian. Hy vọng bài viết trên của
              Vieclam24h.vn đã mang đến thông tin hữu ích và giúp bạn lựa chọn
              công việc part time phù hợp. Truy cập Vieclam24h.vn ngay hôm nay
              để apply vị trí mơ ước nhé!
            </Paragraph>
            <Button
              type="primary"
              className="bg-blue-500 hover:bg-blue-600 mt-4 w-full sm:w-auto"
            >
              <Link to="/jobs">TÌM VIỆC PART TIME TẠI ĐÂY</Link>
            </Button>
            <Image
              src="https://images.unsplash.com/photo-1600585154347-be6161a56a0c"
              alt="Conclusion"
              className="rounded-lg w-full h-64 object-cover my-4"
            />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PartTimeGuide;
