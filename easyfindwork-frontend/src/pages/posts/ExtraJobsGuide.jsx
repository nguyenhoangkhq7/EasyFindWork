import React from "react";
import { Typography, List, Card, Image, Button } from "antd";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const jobs = [
  {
    id: 1,
    title: "Content Creator",
    description:
      "Không nhất thiết phải cần tới năng khiếu viết lách, bạn vẫn có thể trở thành một content creator trên nhiều nền tảng và có thêm thu nhập ngoài giờ hành chính. Những công việc có thể bao gồm: sáng tạo hình ảnh (chụp, thiết kế…), dựng video (quay, dựng, biên tập…), viết lách (bài SEO, bài quảng cáo, bài cộng tác cho báo, viết review, viết truyện…). Đây là những công việc có thể làm tại nhà, không cần vốn, không đặt cọc.",
    image: "https://images.unsplash.com/photo-1455390582262-044c498ce311",
    link: "/jobs/content-creator",
  },
  {
    id: 2,
    title: "Dịch thuật/Phiên dịch",
    description:
      "Đây là việc làm thêm cực phù hợp với những ai thành thạo ngoại ngữ. Bạn có thể nhận dịch tài liệu từ tiếng nước ngoài sang tiếng Việt hoặc phiên dịch part-time cho những công ty có nhu cầu. Chỉ cần chăm chỉ, kỹ năng tốt, bạn hoàn toàn có thể nhận được mức thu nhập khá tốt và ổn định tùy theo năng lực cá nhân.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    link: "/jobs/translator",
  },
  {
    id: 3,
    title: "Trực page",
    description:
      "Công việc tương đối đơn giản là trả lời các bình luận hoặc tin nhắn từ khách hàng tới trang fanpage của doanh nghiệp. Thông thường, sẽ có các kịch bản chăm sóc khách hàng được soạn thảo sẵn để bạn tham khảo và thực hiện theo. Thời gian trực page thường chia theo ca, bạn có thể tranh thủ thời gian ngoài giờ vào buổi tối.",
    image: "https://images.unsplash.com/photo-1600585154347-be6161a56a0c",
    link: "/jobs/direct-page",
  },
  {
    id: 4,
    title: "Tiếp thị liên kết",
    description:
      "Nếu bạn sở hữu một trang mạng xã hội có lượng người theo dõi tốt, một website có khách truy cập thường xuyên, bạn hoàn toàn có thể kiếm thêm tiền từ tiếp thị liên kết (Affiliate Marketing). Đây là hình thức kiếm tiền mang lại nguồn thu tương đối hấp dẫn. Bạn có thể hợp tác cùng các đơn vị liên kết để đặt đường link bán hàng và nhận hoa hồng từ số sản phẩm bán ra.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    link: "/jobs/affiliate",
  },
  {
    id: 5,
    title: "Kinh doanh đồ handmade",
    description:
      "Bạn khéo tay, thích làm các sản phẩm thủ công như đồ đan, móc, đồ mộc, trang sức… Bạn có thể bán các sản phẩm trên trang mạng xã hội cá nhân hoặc tạo gian hàng nhỏ trên các sàn thương mại điện tử và bán sản phẩm tự làm trong thời gian rảnh.",
    image: "https://images.unsplash.com/photo-1600585154347-be6161a56a0c",
  },
  {
    id: 6,
    title: "Kinh doanh POD",
    description:
      "Kinh doanh POD (Print-on-Demand) là một trong những công việc mới nổi những năm gần đây. Bạn sẽ bán các ý tưởng thiết kế để in lên đồ vật (áo thun, cốc uống nước, túi xách, ốp điện thoại…) trên một nền tảng được cung cấp sẵn. Một bên liên kết sẽ thực hiện việc in ấn, đóng gói và giao tận tay, bạn sẽ được hưởng lợi nhuận từ mỗi sản phẩm bán ra.",
    image: "https://images.unsplash.com/photo-1455390582262-044c498ce311",
  },
  {
    id: 7,
    title: "Xe ôm công nghệ",
    description:
      "Với sự phát triển mạnh mẽ của nhiều nền tảng gọi xe trực tuyến như Grab, Be, Xanh SM… và nhu cầu đi lại lớn tại các thành phố, nhiều dân văn phòng có thể tranh thủ làm thêm vài “cuốc” xe sau giờ làm để có thêm thu nhập.",
    image: "https://images.unsplash.com/photo-1596524430610-40125146e3c2",
  },
  {
    id: 8,
    title: "Gia sư/Đào tạo",
    description:
      "Đây là một trong những việc làm thêm có thu nhập tốt và nhu cầu cao. Bạn có thể dạy kèm ngoại ngữ hoặc các môn học theo nhu cầu. Thời lượng mỗi buổi học thường chỉ kéo dài từ 1,5 đến 2 giờ nhưng mang lại mức thu nhập hấp dẫn.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    link: "/jobs/tutor",
  },
  {
    id: 9,
    title: "Giữ trẻ/Chăm sóc trẻ em",
    description:
      "Nếu bạn là người có kinh nghiệm chăm sóc trẻ em và có nhiều thời gian rảnh sau giờ làm, bạn hoàn toàn có thể nhận các việc làm thêm như chăm sóc trẻ (tắm cho trẻ em, massage cho trẻ em…) hoặc trông giữ trẻ theo giờ.",
    image: "https://images.unsplash.com/photo-1600585154347-be6161a56a0c",
  },
  {
    id: 10,
    title: "Kế toán",
    description:
      "Kế toán cũng là một trong những việc làm thêm ngoài giờ có mức thu nhập tốt, nhất là mùa cuối năm, khi các doanh nghiệp cần làm báo cáo tài chính. Bạn là kế toán có kinh nghiệm lâu năm, bạn hoàn toàn có thể nhận công việc làm thêm.",
    image: "https://images.unsplash.com/photo-1455390582262-044c498ce311",
  },
  {
    id: 11,
    title: "Nhân viên bán hàng",
    description:
      "Bán hàng là việc làm thêm ngoài giờ phổ biến được nhiều người lựa chọn. Bạn có thể tìm việc làm nhân viên bán hàng tại nhiều cửa hàng hoặc siêu thị với giờ làm theo ca (khoảng 4 giờ/ca) vào buổi tối. Công việc này không yêu cầu cao về kinh nghiệm hay chuyên môn.",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df",
    link: "/jobs/sales",
  },
  {
    id: 12,
    title: "Designer",
    description:
      "Nếu bạn có trình độ thiết kế tốt, khả năng thiết kế đa dạng trong nhiều lĩnh vực, bạn hoàn toàn có thể nhận thêm việc thiết kế thuê ngoài từ các doanh nghiệp hoặc công ty có nhu cầu. Đây là việc làm thêm có thu nhập tương đối tốt.",
    image: "https://images.unsplash.com/photo-1600585154347-be6161a56a0c",
    link: "/jobs/design",
  },
  {
    id: 13,
    title: "Trợ lý online",
    description:
      "Bạn sẽ đảm nhận các đầu việc về rà soát các loại văn bản giấy tờ, trả lời email, đặt lịch hẹn, sắp xếp lịch làm việc, nhắc việc… cho khách hàng. Công việc có thể hoàn toàn thực hiện online vào buổi tối.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    link: "/jobs/assistant",
  },
];

const ExtraJobsGuide = () => {
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
              Việc Làm Thêm Ngoài Giờ Hành Chính
            </Title>
            <Text className="block text-gray-500 text-center mb-4">
              Bởi Nghề Nghiệp Việc Làm 24h • 2 tháng trước
            </Text>
            <Paragraph className="text-gray-600 text-center">
              Tìm việc làm thêm phù hợp với bạn ngay hôm nay!
            </Paragraph>
            <Paragraph className="text-gray-700 leading-relaxed">
              Việc làm thêm ngoài giờ hành chính là cơ hội tuyệt vời để tăng thu
              nhập mà vẫn linh hoạt thời gian. Dù bạn là dân văn phòng, sinh
              viên hay freelancer, có rất nhiều công việc phù hợp với kỹ năng và
              lịch trình của bạn. Hãy khám phá top 13 việc làm thêm phổ biến
              dưới đây!
            </Paragraph>
            <Button
              type="primary"
              className="bg-blue-500 hover:bg-blue-600 mt-4 w-full sm:w-auto"
            >
              <Link to="/jobs">TÌM VIỆC LÀM THÊM TẠI ĐÂY</Link>
            </Button>

            <Title level={3} className="text-blue-500 mt-6">
              Top việc làm ngoài giờ hành chính lương cao
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
              Lưu ý khi tìm việc làm thêm ngoài giờ
            </Title>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Cảnh giác với những công việc phải trả phí để nhận việc.</li>
              <li>Chỉ nên tìm việc trên các website việc làm uy tín.</li>
              <li>Tìm hiểu kỹ thông tin về thương hiệu tuyển dụng.</li>
              <li>
                Tránh những việc làm có mức lương bất thường so với mô tả.
              </li>
            </ul>
            <Image
              src="https://images.unsplash.com/photo-1596524430610-40125146e3c2"
              alt="Caution"
              className="rounded-lg w-full h-64 object-cover my-4"
            />

            <Title level={3} className="text-blue-500 mt-6">
              Lời kết
            </Title>
            <Paragraph className="text-gray-700">
              Trên đây là top 13 việc làm thêm ngoài giờ hành chính phổ biến
              hiện nay. Hy vọng bài viết từ Nghề Nghiệp Việc Làm 24h đã giúp bạn
              tìm được công việc phù hợp để tăng thêm thu nhập. Truy cập
              Vieclam24h.vn ngay hôm nay để apply vị trí mơ ước!
            </Paragraph>
            <Button
              type="primary"
              className="bg-blue-500 hover:bg-blue-600 mt-4 w-full sm:w-auto"
            >
              <Link to="/jobs">TÌM VIỆC LÀM THÊM TẠI ĐÂY</Link>
            </Button>
          </Card>
        </motion.div>
      </div>
      <footer className="bg-blue-900 text-white p-4 text-center mt-6">
        <Paragraph className="text-sm">
          Bắt đầu tìm việc ngay hôm nay!
        </Paragraph>
        <div className="mt-2">
          <Link to="/terms" className="text-blue-300 hover:text-white mr-4">
            Điều khoản sử dụng
          </Link>
          <Link to="/privacy" className="text-blue-300 hover:text-white">
            Chính sách bảo mật
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default ExtraJobsGuide;
