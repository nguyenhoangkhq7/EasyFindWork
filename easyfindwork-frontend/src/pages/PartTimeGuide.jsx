import React from 'react';
import { Layout, Typography, List, Card, Row, Col, Image, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const PartTimeGuide = () => {
  const jobs = [
    { 
      id: 1, 
      title: 'Gia sư part time', 
      description: 'Gia sư part time là công việc được nhiều bạn sinh viên sư phạm hoặc ngoại ngữ ưa chuộng. Công việc tương đối nhẹ nhàng, thời gian dạy kèm thường là buổi tối, hình thức dạy online hay tại nhà còn phụ thuộc vào thoả thuận với phụ huynh và học sinh. Gia sư part time thường dạy 6 – 8 tiếng trong tuần. Mức lương công việc này dao động từ 100.000 – 200.000 đồng/giờ.', 
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' 
    },
    { 
      id: 2, 
      title: 'Cộng tác viên làm đồ thủ công', 
      description: 'Nhiều công ty kinh doanh đồ handmade, phụ kiện tuyển nhân viên part time làm đồ thủ công. Bạn phải khéo tay, tỉ mỉ và cẩn thận để hoàn thành sản phẩm theo yêu cầu. Mức lương của công việc này phụ thuộc vào năng suất làm việc, dao động từ 1 – 2 triệu đồng/tháng.', 
      image: 'https://images.unsplash.com/photo-1600585154347-be6161a56a0c' 
    },
    { 
      id: 3, 
      title: 'Tài xế công nghệ', 
      description: 'Hiện nay, nhiều hãng xe công nghệ như Grab, Gojek, Be, Xanh SM,… hoặc các nền tảng thương mại điện tử như Shopee, Lazada, Tiki,… tuyển tài xế part time chuyên chở khách hoặc giao hàng. Thời gian làm việc linh hoạt, mức lương tài xế công nghệ dao động từ 8000 – 10000 đồng/km, tuỳ vào nền tảng xe công nghệ.', 
      image: 'https://images.unsplash.com/photo-1600585154347-be6161a56a0c' 
    },
    { 
      id: 4, 
      title: 'Nhân viên bán hàng part time', 
      description: 'Nhân viên bán hàng là người có trách nhiệm đón tiếp, gợi ý, tư vấn các sản phẩm/dịch vụ phù hợp với nhu cầu của khách hàng. Họ còn sắp xếp, trưng bày và bảo quản hàng hoá cũng như giải đáp các thắc mắc của khách hàng. Thời gian làm việc từ 4 – 5 tiếng/ca, đa số lịch làm việc bao gồm các ngày cuối tuần và ngày lễ, Tết. Mức lương nhân viên bán hàng part time dao động từ 20.000 – 30.000 đồng/giờ.', 
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df' 
    },
    { 
      id: 5, 
      title: 'Nhân viên phục vụ part time', 
      description: 'Nhân viên phục vụ thường làm việc tại các quán cà phê, nhà hàng, quán ăn,… Công việc chính của nhân viên phục vụ part time là đón tiếp, order món và cung cấp đồ ăn/thức uống theo yêu cầu của khách hàng. Thời gian làm việc từ 4 – 5 tiếng/ca, đa số lịch làm việc bao gồm các ngày cuối tuần và ngày lễ, Tết. Mức lương nhân viên phục vụ part time từ 20.000 – 30.000 đồng/giờ.', 
      image: 'https://images.unsplash.com/photo-1592861956120-e524fc739696' 
    },
    { 
      id: 6, 
      title: 'Nhân viên nhập liệu part time', 
      description: 'Công việc của nhân viên nhập liệu hay nhân viên đánh máy part time là nhập liệu, rà soát lỗi sai, xác minh, cập nhật và chỉnh sửa dữ liệu. Công việc này khá đơn giản, bạn chỉ cần cẩn thận, tỉ mỉ nhập liệu chính xác. Mức lương nhân viên nhập liệu part time dao động từ 1 – 4 triệu đồng/tháng.', 
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' 
    },
    { 
      id: 7, 
      title: 'Cộng tác viên viết bài', 
      description: 'Công việc của cộng tác viên viết bài là viết lách theo yêu cầu như bài SEO, bài PR cho báo, bài viết social,… Đây là công việc part time được nhiều bạn trẻ ưa chuộng, mang lại nguồn thu nhập tương đối ổn định. Mức lương cộng tác viên viết bài dao động từ 50.000 – 500.000 đồng/bài viết.', 
      image: 'https://images.unsplash.com/photo-1455390582262-044c498ce311' 
    },
    { 
      id: 8, 
      title: 'Cộng tác viên thiết kế', 
      description: 'Đây là công việc part time tuyệt vời cho những ai có khả năng sử dụng thành thạo các phần mềm thiết kế. Dựa theo yêu cầu của công ty tuyển dụng, các bạn có thể thiết kế banner, poster quảng cáo, hình ảnh trên các trang social,… Mức lương cộng tác viên thiết kế dao động từ 50.000 – 400.000 đồng/sản phẩm.', 
      image: 'https://images.unsplash.com/photo-1600585154347-be6161a56a0c', 
      link: '/jobs/design' 
    },
    { 
      id: 9, 
      title: 'Nhân viên trực page', 
      description: 'Công việc của nhân viên trực page theo dõi và quản lý các hoạt động trên mạng xã hội của công ty hoặc cửa hàng. Cụ thể thì nhân viên trực page là người tư vấn, báo giá, chốt đơn hàng, kiểm soát phản hồi,… khi có khách nhắn tin cho fanpage. Thời gian làm việc của nhân viên trực page part time từ 4 – 5 tiếng/ngày, mức lương dao động từ 2 – 4 triệu đồng/tháng.', 
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', 
      link: '/sidhrect-page' 
    },
    { 
      id: 10, 
      title: 'Nhân viên telesales part time', 
      description: 'Nhân viên telesales hay nhân viên chăm sóc khách hàng là công việc part time được nhiều bạn sinh viên ưa chuộng. Công việc chủ yếu là trực tổng đài, giải đáp thắc mắc, khiếu nại và tư vấn sản phẩm/dịch vụ. Một số công việc còn yêu cầu nhân viên telesales chào bán sản phẩm/dịch vụ theo data được cung cấp. Mức lương dao động từ 2 – 4 triệu đồng, kèm hoa hồng nếu có.', 
      image: 'https://images.unsplash.com/photo-1596524430610-40125146e3c2', 
      link: '/jobs/telesales' 
    },
    { 
      id: 11, 
      title: 'Nhân viên bảo vệ part time', 
      description: 'Nhân viên bảo vệ là công việc phù hợp với phái nam, công việc này chủ yếu là quản lý, giám sát tình hình an ninh và trông coi tài sản tại công ty hoặc nhà hàng, quán ăn, cửa hàng,… Thời gian làm việc theo ca. Công việc này thường phải làm vào cuối tuần và ngày lễ, Tết. Mức lương của nhân viên bảo vệ part time dao động từ 3 – 5 triệu đồng/tháng.', 
      image: 'https://images.unsplash.com/photo-1596524430610-40125146e3c2', 
      link: '/jobs/security' 
    },
  ];

  return (
    <Layout style={{ padding: '0 50px', minHeight: '100vh' }}>
      <Content style={{ margin: '20px 0' }}>
        <Card>
          <Title level={2}>Nhân viên part time là gì? 11 công việc part time lương cao đang chờ bạn</Title>
          <Text>Bởi Thuyen Dang • 2 tháng trước</Text>
          <Paragraph>Chia sẻ bài viết này</Paragraph>
          <Paragraph>
            Hiện nay, nhu cầu tuyển dụng nhân viên part time ngày càng tăng cao, đặc biệt phù hợp các bạn sinh viên muốn làm việc linh hoạt và kiếm thêm thu nhập. Vậy nhân viên part time là gì? Tuyển nhân viên part time có yêu cầu gì? Mức lương nhân viên part time ra sao? Nếu bạn đang quan tâm những vấn đề này thì bài viết dưới đây của Nghề Nghiệp Việc Làm 24h chắc chắn dành cho bạn!
          </Paragraph>
          <Button type="primary">
            <Link to="/jobs">TÌM VIỆC PART TIME TẠI ĐÂY</Link>
          </Button>

          <Title level={3}>Nhân viên part time là gì?</Title>
          <Paragraph>
            Nhân viên part time là những người làm việc được trả lương theo giờ. Tính chất công việc thường đơn giản, không yêu cầu chuyên môn cao. Thời gian làm việc part time dựa vào nhu cầu và thỏa thuận giữa người lao động và người sử dụng lao động. Thay vì làm việc đủ 8 tiếng/ngày và 5 ngày/tuần, thời gian làm việc của nhân viên part time thường ngắn hơn.
          </Paragraph>
          <Image src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3" alt="Part Time Intro" />

          <Title level={3}>Mức lương tối thiểu là bao nhiêu ?</Title>
          <Paragraph>
            Mức lương trung bình của nhân viên part time chịu ảnh hưởng theo quy định về mức lương tối thiểu vùng. Theo quy định tại Điều 3 Nghị định 38/2022/NĐ-CP: Mức lương tối thiểu ở các khu vực thuộc vùng I là 22.500 đồng/giờ, vùng II là 20.000 đồng/giờ, vùng III là 17.500 đồng/giờ và vùng IV là 15.600 đồng/giờ. Danh mục địa bàn vùng 1, vùng 2, vùng 3 và vùng 4 được quy định tại Phụ lục ban hành kèm theo Nghị định 38/2022/NĐ-CP.
          </Paragraph>

          <Title level={3}>Cách tính lương nhân viên part time</Title>
          <Paragraph>
            Cách tính lương thường được quy định rõ ràng thông qua phỏng vấn và mô tả công việc. Hiện nay, có 4 cách tính lương phổ biến:
          </Paragraph>
          <ul>
            <li>
              <strong>Tính lương theo giờ:</strong> Mức lương sẽ được thỏa thuận giữa người sử dụng lao động và người lao động. Lấy tiền lương của một giờ làm việc nhân với thời gian làm việc sẽ cho ra lương theo giờ của người lao động.
            </li>
            <li>
              <strong>Tính lương theo ca:</strong> Mức tính lương làm việc theo ca có thể cao hơn mức tính lương theo giờ. Tùy vào tính chất công việc, mức tính lương sẽ được thỏa thuận khác nhau, người lao động sẽ lựa chọn số ca làm việc và thỏa thuận mức tính lương.
            </li>
            <li>
              <strong>Tính lương theo tháng:</strong> Người lao động phải đi làm đủ số buổi yêu cầu nếu muốn nhận lương theo tháng.
            </li>
            <li>
              <strong>Tính lương theo KPI:</strong> Người lao động phải hoàn thành KPI về số lượng sản phẩm được quy định trong ca làm việc để nhận được mức lương thỏa thuận ban đầu.
            </li>
          </ul>
          <Paragraph>
            <strong>Lưu ý:</strong>
          </Paragraph>
          <Paragraph>
            Một số ngành nghề thường yêu cầu làm việc đêm hoặc các ngày cuối tuần, ngày lễ. Lương làm việc trong những ngày này thường cao hơn tiền lương cơ bản, cụ thể như sau:
          </Paragraph>
          <ul>
            <li>Làm ca đêm: Nhân viên nhận thêm tối thiểu 30% tiền lương cơ bản của ngày làm việc đó.</li>
            <li>Làm thêm giờ: Nhân viên nhận được mức lương cao hơn 130% so với các ca hành chính.</li>
            <li>Làm vào ngày cuối tuần: Nhân viên nhận được mức lương cao hơn 200% so với các ngày trong tuần.</li>
            <li>Làm vào ngày lễ, Tết: Nhân viên nhận được mức lương cao hơn 300% so với các ngày thông thường.</li>
          </ul>
          <Paragraph>
            Đồng thời, Bộ Luật lao động quy định: “Người lao động hưởng lương giờ, ngày, tuần thì được trả lương sau giờ, ngày, tuần làm việc hoặc được trả gộp do hai bên thỏa thuận, nhưng ít nhất 15 ngày phải được trả gộp 01 lần”.
          </Paragraph>
          <Paragraph>
            “Người lao động hưởng lương theo sản phẩm, theo khoán được trả lương theo thỏa thuận của 02 bên; nếu công việc phải làm trong nhiều tháng thì hằng tháng được tạm ứng tiền lương theo khối lượng công việc đã làm trong tháng”.
          </Paragraph>
          <Image src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3" alt="Payroll Calculation" />

          <Title level={3}>Các vị trí tuyển nhân viên part time phổ biến hiện nay</Title>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={jobs}
            renderItem={item => (
              <List.Item>
                <Card title={`${item.id}. ${item.title}`}>
                  <Image src={item.image} alt={item.title} style={{ maxWidth: '100%' }} />
                  <Paragraph>{item.description}</Paragraph>
                  {item.link && (
                    <Button type="primary">
                      <Link to={item.link}>TÌM VIỆC {item.title.toUpperCase()} TẠI ĐÂY</Link>
                    </Button>
                  )}
                </Card>
              </List.Item>
            )}
          />

          <Title level={3}>Kết luận</Title>
          <Paragraph>
            Vị trí nhân viên part time sẽ phù hợp với những bạn muốn kiếm thêm thu nhập nhưng vẫn linh hoạt thời gian làm việc. Hy vọng bài viết trên của Vieclam24h.vn đã mang đến cho bạn những thông tin hữu ích và giúp bạn lựa chọn công việc part time phù hợp. Truy cập Vieclam24h.vn ngay hôm nay để apply vị trí mơ ước nhé!
          </Paragraph>
          <Button type="primary">
            <Link to="/jobs">TÌM VIỆC PART TIME TẠI ĐÂY</Link>
          </Button>
          <Image src="https://images.unsplash.com/photo-1600585154347-be6161a56a0c" alt="Conclusion" />
        </Card>
      </Content>
    </Layout>
  );
};

export default PartTimeGuide;