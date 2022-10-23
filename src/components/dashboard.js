import React, { Fragment, useState } from 'react'
import Breadcrumb from './common/breadcrumb'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import {
  Navigation,
  Box,
  MessageSquare,
  Users,
  Briefcase,
  CreditCard,
  ShoppingCart,
  Calendar,
} from 'react-feather'
import CountUp from 'react-countup'
import { Chart } from 'react-google-charts'
import moment from 'moment'
import { Bar, Line } from 'react-chartjs-2'
import {
  lineOptions,
  buyOption,
  employeeData,
  employeeOptions,
} from '../constants/chartData'
// image impoer
import user2 from '../assets/images/dashboard/user2.jpg'
import user1 from '../assets/images/dashboard/user1.jpg'
import man from '../assets/images/dashboard/man.png'
import user from '../assets/images/dashboard/user.png'
import designer from '../assets/images/dashboard/designer.jpg'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Media,
  Row,
  Table,
} from 'reactstrap'

const GET_ORDER = gql`
  query orders {
    orders {
      createdAt
      multiorder
      id
      paidstatus
      User {
        name
      }
    }
  }
`
const GET_USERS = gql`
  query users {
    users {
      id
      createdAt
      name
      email
    }
  }
`

const Dashboard = () => {
  const [formState, setFormState] = useState({
    orderdata: '',
    users: '',
  })

  var { loading, data } = useQuery(GET_ORDER, {
    onCompleted: (data) => {
      console.log('data.', data.orders)
      setFormState({
        ...formState,
        orderdata: data.orders,
      })
    },
    onError: (error) => {
      console.log('err', error)
    },
  })
  var { data: data1 } = useQuery(GET_USERS, {
    onCompleted: (data1) => {
      setFormState({
        ...formState,
        users: data1.users,
      })
    },
    onError: (error) => {
      console.log('err', error)
    },
  })
  const lineData = {
    labels: ['100', '200', '300', '400', '500', '600', '700', '800'],
    datasets: [
      {
        lagend: 'none',
        data: [2.5, 3, 3, 0.9, 1.3, 1.8, 3.8, 1.5],
        borderColor: '#ff8084',
        backgroundColor: '#ff8084',
        borderWidth: 2,
      },
      {
        lagend: 'none',
        data: [3.8, 1.8, 4.3, 2.3, 3.6, 2.8, 2.8, 2.8],
        borderColor: '#a5a5a5',
        backgroundColor: '#a5a5a5',
        borderWidth: 2,
      },
    ],
  }

  const buyData = {
    labels: ['', '10', '20', '30', '40', '50'],
    datasets: [
      {
        backgroundColor: 'transparent',
        borderColor: '#13c9ca',
        data: [20, 5, 80, 10, 100, 15],
      },
      {
        backgroundColor: 'transparent',
        borderColor: '#a5a5a5',
        data: [0, 50, 20, 70, 30, 27],
      },
      {
        backgroundColor: 'transparent',
        borderColor: '#ff8084',
        data: [0, 30, 40, 10, 86, 40],
      },
    ],
  }

  const doughnutOptions = {
    title: '',
    pieHole: 0.35,
    pieSliceBorderColor: 'none',
    colors: ['#ff8084', '#13c9ca', '#a5a5a5'],
    legend: {
      position: 'none',
    },
    pieSliceText: 'none',
    tooltip: {
      trigger: 'none',
    },
    animation: {
      startup: true,
      easing: 'linear',
      duration: 1500,
    },
    chartArea: { left: 0, top: 10, width: '360px', height: '100%' },
    enableInteractivity: false,
  }
  const pieOptions = {
    title: '',
    pieHole: 1,
    slices: [
      {
        color: '#ff8084',
      },
      {
        color: '#13c9ca',
      },
      {
        color: '#f0b54d',
      },
    ],
    tooltip: {
      showColorCode: false,
    },
    chartArea: { left: 0, top: 10, width: '360px', height: '100%' },
    legend: 'none',
  }
  const LineOptions = {
    hAxis: {
      textPosition: 'none',
      baselineColor: 'transparent',
      gridlineColor: 'transparent',
    },
    vAxis: {
      textPosition: 'none',
      baselineColor: 'transparent',
      gridlineColor: 'transparent',
    },
    colors: ['#ff8084'],
    legend: 'none',
  }
  const LineOptions1 = {
    hAxis: {
      textPosition: 'none',
      baselineColor: 'transparent',
      gridlineColor: 'transparent',
    },
    vAxis: {
      textPosition: 'none',
      baselineColor: 'transparent',
      gridlineColor: 'transparent',
    },
    colors: ['#13c9ca'],
    chartArea: { left: 0, top: 0, width: '100%', height: '100%' },
    legend: 'none',
  }
  const LineOptions2 = {
    hAxis: {
      textPosition: 'none',
      baselineColor: 'transparent',
      gridlineColor: 'transparent',
    },
    vAxis: {
      textPosition: 'none',
      baselineColor: 'transparent',
      gridlineColor: 'transparent',
    },
    colors: ['#f5ce8a'],
    chartArea: { left: 0, top: 0, width: '100%', height: '100%' },
    legend: 'none',
  }
  const LineOptions3 = {
    hAxis: {
      textPosition: 'none',
      baselineColor: 'transparent',
      gridlineColor: 'transparent',
    },
    vAxis: {
      textPosition: 'none',
      baselineColor: 'transparent',
      gridlineColor: 'transparent',
    },
    colors: ['#a5a5a5'],
    chartArea: { left: 0, top: 0, width: '100%', height: '100%' },
    legend: 'none',
  }

  return (
    <Fragment>
      {formState && (
        <>
          <Breadcrumb title="Dashboard" parent="Dashboard" />
          <Container fluid={true}>
            <Row>
              <Col xl="6 xl-50" md="6">
                <Card className=" o-hidden widget-cards">
                  <CardBody className="bg-warning">
                    <Media className="static-top-widget row">
                      <div className="icons-widgets col-4">
                        <div className="align-self-center text-center">
                          <Navigation className="font-warning" />
                        </div>
                      </div>
                      <Media body className="col-8">
                        <span className="m-0">총 주문수량</span>
                        <h3 className="mb-0">
                          <CountUp
                            className="counter"
                            end={formState.orderdata.length}
                          />
                          {/* <small> This Month</small> */}건
                        </h3>
                      </Media>
                    </Media>
                  </CardBody>
                </Card>
              </Col>
              <Col xl="6 xl-50" md="6">
                <Card className=" o-hidden  widget-cards">
                  <CardBody className="bg-secondary ">
                    <Media className="static-top-widget row">
                      <div className="icons-widgets col-4">
                        <div className="align-self-center text-center">
                          <Box className="font-secondary" />
                        </div>
                      </div>
                      <Media body className="col-8">
                        <span className="m-0">회원 수</span>
                        <h3 className="mb-0">
                          <CountUp
                            className="counter"
                            end={formState.users.length - 1}
                          />
                          명{/* <small> This Month</small> */}
                        </h3>
                      </Media>
                    </Media>
                  </CardBody>
                </Card>
              </Col>
              {/* <Col xl="3 xl-50" md="6">
                <Card className="o-hidden widget-cards">
                  <CardBody className="bg-primary">
                    <Media className="static-top-widget row">
                      <div className="icons-widgets col-4">
                        <div className="align-self-center text-center">
                          <MessageSquare className="font-primary" />
                        </div>
                      </div>
                      <Media body className="col-8">
                        <span className="m-0">Messages</span>
                        <h3 className="mb-0">
                          $ <CountUp className="counter" end={formState.orderdata.paidstatus} />
                          <small> This Month</small>
                        </h3>
                      </Media>
                    </Media>
                  </CardBody>
                </Card>
              </Col> */}
              {/* <Col xl="3 xl-50" md="6">
                <Card className=" o-hidden widget-cards">
                  <CardBody className="bg-danger ">
                    <Media className="static-top-widget row">
                      <div className="icons-widgets col-4">
                        <div className="align-self-center text-center">
                          <Users className="font-danger" />
                        </div>
                      </div>
                      <Media body className="col-8">
                        <span className="m-0">New Vendors</span>
                        <h3 className="mb-0">
                          $ <CountUp className="counter" end={45631} />
                          <small> This Month</small>
                        </h3>
                      </Media>
                    </Media>
                  </CardBody>
                </Card>
              </Col> */}
              {/* <Col xl="6 xl-100">
                <Card>
                  <CardHeader>
                    <h5>Market Value</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="market-chart">
                      <Bar
                        data={lineData}
                        options={lineOptions}
                        width={778}
                        height={308}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col> */}
              <Col xl="12 xl-100">
                <Card>
                  <CardHeader>
                    <h5>최근 주문</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="user-status table-responsive latest-order-table">
                      <Table borderless>
                        <thead>
                          <tr>
                            <th scope="col">주문 날짜</th>
                            <th scope="col">주문 ID</th>
                            <th scope="col">주문자</th>

                            <th scope="col">입금확인</th>
                            <th scope="col">주문상세</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formState.orderdata &&
                            formState.orderdata.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  {moment(new Date(item.createdAt)).format(
                                    'YYYY-MM-DD-A hh:mm',
                                  )}
                                </td>
                                <td>{item.id}</td>
                                <th scope="row" className="drag-pointer">
                                  {item.User.name}
                                </th>

                                <td> {item.paidstatus}</td>
                                <td>
                                  {' '}
                                  <Link to="mutikart-admin/dashboard">
                                    상세보기
                                  </Link>
                                </td>
                              </tr>
                            ))}

                          {/* <tr>
                            <td>1</td>
                            <td className="digits">$120.00</td>
                            <td className="font-danger">Bank Transfers</td>
                            <td className="digits">On Way</td>
                          </tr>
                          */}
                        </tbody>
                      </Table>
                      <a href="#javaScript" className="btn btn-primary">
                        모든 주문 보기
                      </a>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xl="12 xl-100">
                <Card>
                  <CardHeader>
                    <h5>최근가입 회원</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="user-status table-responsive latest-order-table">
                      <Table borderless>
                        <thead>
                          <tr>
                            <th scope="col">가입 날짜</th>
                            <th scope="col">회원 ID</th>
                            <th scope="col">성함</th>

                            <th scope="col">이메일</th>

                          </tr>
                        </thead>
                        <tbody>
                          {formState.users !== '' &&
                            formState.users.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  {moment(new Date(item.createdAt)).format(
                                    'YYYY-MM-DD-A hh:mm',
                                  )}
                                </td>
                                <td>{item.id}</td>

                                <td> {item.name}</td>
                                <td> {item.email}</td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                      <a href="#javaScript" className="btn btn-primary">
                        모든 유저 보기
                      </a>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              {/* <Col xl="3 xl-50" md="6">
                <Card className=" order-graph sales-carousel">
                  <CardHeader>
                    <h6>Total Sales</h6>
                    <Row>
                      <Col className="col-6">
                        <div className="small-chartjs">
                          <div
                            className="flot-chart-placeholder"
                            id="simple-line-chart-sparkline-3"
                          >
                            <Chart
                              height={'60px'}
                              chartType="LineChart"
                              loader={<div>Loading Chart</div>}
                              data={[
                                ['x', 'time'],
                                [0, 20],
                                [1, 5],
                                [2, 120],
                                [3, 10],
                                [4, 140],
                                [5, 15],
                              ]}
                              options={LineOptions}
                              legend_toggle
                            />
                          </div>
                        </div>
                      </Col>
                      <Col className="col-6">
                        <div className="value-graph">
                          <h3>
                            42%{' '}
                            <span>
                              <i className="fa fa-angle-up font-primary"></i>
                            </span>
                          </h3>
                        </div>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Media>
                      <Media body>
                        <span>Sales Last Month</span>
                        <h2 className="mb-0">9054</h2>
                        <p>
                          0.25%{' '}
                          <span>
                            <i className="fa fa-angle-up"></i>
                          </span>
                        </p>
                        <h5 className="f-w-600 f-16">Gross sales of August</h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting
                        </p>
                      </Media>
                      <div className="bg-primary b-r-8">
                        <div className="small-box">
                          <Briefcase />
                        </div>
                      </div>
                    </Media>
                  </CardBody>
                </Card>
              </Col> */}
              {/* <Col xl="3 xl-50" md="6">
                <Card className=" order-graph sales-carousel">
                  <CardHeader>
                    <h6>Total purchase</h6>
                    <Row>
                      <Col className="col-6">
                        <div className="small-chartjs">
                          <div
                            className="flot-chart-placeholder"
                            id="simple-line-chart-sparkline"
                          >
                            <Chart
                              height={'60px'}
                              chartType="LineChart"
                              loader={<div>Loading Chart</div>}
                              data={[
                                ['x', 'time'],
                                [0, 85],
                                [1, 83],
                                [2, 90],
                                [3, 70],
                                [4, 85],
                                [5, 60],
                                [6, 65],
                                [7, 63],
                                [8, 68],
                                [9, 68],
                                [10, 65],
                                [11, 40],
                                [12, 60],
                                [13, 75],
                                [14, 70],
                                [15, 90],
                              ]}
                              options={LineOptions1}
                              legend_toggle
                            />
                          </div>
                        </div>
                      </Col>
                      <Col className="col-6">
                        <div className="value-graph">
                          <h3>
                            20%{' '}
                            <span>
                              <i className="fa fa-angle-up font-secondary"></i>
                            </span>
                          </h3>
                        </div>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Media>
                      <Media body>
                        <span>Monthly Purchase</span>
                        <h2 className="mb-0">2154</h2>
                        <p>
                          0.13%{' '}
                          <span>
                            <i className="fa fa-angle-up"></i>
                          </span>
                        </p>
                        <h5 className="f-w-600 f-16">Avg Gross purchase</h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting
                        </p>
                      </Media>
                      <div className="bg-secondary b-r-8">
                        <div className="small-box">
                          <CreditCard />
                        </div>
                      </div>
                    </Media>
                  </CardBody>
                </Card>
              </Col> */}
              {/* <Col xl="3 xl-50" md="6">
                <Card className="order-graph sales-carousel">
                  <CardHeader>
                    <h6>Total cash transaction</h6>
                    <Row>
                      <Col className="col-6">
                        <div className="small-chartjs">
                          <div
                            className="flot-chart-placeholder"
                            id="simple-line-chart-sparkline-2"
                          >
                            <Chart
                              height={'60px'}
                              chartType="LineChart"
                              loader={<div>Loading Chart</div>}
                              data={[
                                ['x', 'time'],
                                [0, 85],
                                [1, 83],
                                [2, 90],
                                [3, 70],
                                [4, 85],
                                [5, 60],
                                [6, 65],
                                [7, 63],
                                [8, 68],
                                [9, 68],
                                [10, 65],
                                [11, 40],
                                [12, 60],
                                [13, 75],
                                [14, 70],
                                [15, 90],
                              ]}
                              options={LineOptions2}
                              legend_toggle
                            />
                          </div>
                        </div>
                      </Col>
                      <Col className="col-6">
                        <div className="value-graph">
                          <h3>
                            28%{' '}
                            <span>
                              <i className="fa fa-angle-up font-warning"></i>
                            </span>
                          </h3>
                        </div>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Media>
                      <Media body>
                        <span>Cash on hand</span>
                        <h2 className="mb-0">4672</h2>
                        <p>
                          0.8%{' '}
                          <span>
                            <i className="fa fa-angle-up"></i>
                          </span>
                        </p>
                        <h5 className="f-w-600 f-16">Details about cash</h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting
                        </p>
                      </Media>
                      <div className="bg-warning b-r-8">
                        <div className="small-box">
                          <ShoppingCart />
                        </div>
                      </div>
                    </Media>
                  </CardBody>
                </Card>
              </Col>
              <Col xl="3 xl-50" md="6">
                <Card className="order-graph sales-carousel">
                  <CardHeader>
                    <h6>Daily Deposits</h6>
                    <Row>
                      <Col className="col-6">
                        <div className="small-chartjs">
                          <div
                            className="flot-chart-placeholder"
                            id="simple-line-chart-sparkline-1"
                          >
                            <Chart
                              height={'60px'}
                              chartType="LineChart"
                              loader={<div>Loading Chart</div>}
                              data={[
                                ['x', 'time'],
                                [0, 85],
                                [1, 83],
                                [2, 90],
                                [3, 70],
                                [4, 85],
                                [5, 60],
                                [6, 65],
                                [7, 63],
                                [8, 68],
                                [9, 68],
                                [10, 65],
                                [11, 40],
                                [12, 60],
                                [13, 75],
                                [14, 70],
                                [15, 90],
                              ]}
                              options={LineOptions3}
                              legend_toggle
                            />
                          </div>
                        </div>
                      </Col>
                      <Col className="col-6">
                        <div className="value-graph">
                          <h3>
                            75%{' '}
                            <span>
                              <i className="fa fa-angle-up font-danger"></i>
                            </span>
                          </h3>
                        </div>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Media>
                      <Media body>
                        <span>Security Deposits</span>
                        <h2 className="mb-0">5782</h2>
                        <p>
                          0.25%{' '}
                          <span>
                            <i className="fa fa-angle-up"></i>
                          </span>
                        </p>
                        <h5 className="f-w-600 f-16">Gross sales of June</h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting
                        </p>
                      </Media>
                      <div className="bg-danger b-r-8">
                        <div className="small-box">
                          <Calendar />
                        </div>
                      </div>
                    </Media>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="12">
                <Card>
                  <CardHeader>
                    <h5>Buy / Sell</h5>
                  </CardHeader>
                  <CardBody className="sell-graph">
                    <Line
                      data={buyData}
                      options={buyOption}
                      width={700}
                      height={350}
                    />
                  </CardBody>
                </Card>
              </Col> */}
              {/* <Col xl="6 xl-100">
                <Card className="height-equal">
                  <CardHeader>
                    <h5>Products Cart</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="user-status table-responsive products-table">
                      <table className="table table-bordernone mb-0">
                        <thead>
                          <tr>
                            <th scope="col">Details</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Status</th>
                            <th scope="col">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Simply dummy text of the printing</td>
                            <td className="digits">1</td>
                            <td className="font-primary">Pending</td>
                            <td className="digits">$6523</td>
                          </tr>
                          <tr>
                            <td>Long established</td>
                            <td className="digits">5</td>
                            <td className="font-secondary">Cancle</td>
                            <td className="digits">$6523</td>
                          </tr>
                          <tr>
                            <td>sometimes by accident</td>
                            <td className="digits">10</td>
                            <td className="font-secondary">Cancle</td>
                            <td className="digits">$6523</td>
                          </tr>
                          <tr>
                            <td>classical Latin literature</td>
                            <td className="digits">9</td>
                            <td className="font-primary">Return</td>
                            <td className="digits">$6523</td>
                          </tr>
                          <tr>
                            <td>keep the site on the Internet</td>
                            <td className="digits">8</td>
                            <td className="font-primary">Pending</td>
                            <td className="digits">$6523</td>
                          </tr>
                          <tr>
                            <td>Molestiae consequatur</td>
                            <td className="digits">3</td>
                            <td className="font-secondary">Cancle</td>
                            <td className="digits">$6523</td>
                          </tr>
                          <tr>
                            <td>Pain can procure</td>
                            <td className="digits">8</td>
                            <td className="font-primary">Return</td>
                            <td className="digits">$6523</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xl="6 xl-100">
                <Card className="height-equal">
                  <CardHeader>
                    <h5>Empolyee Status</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="user-status table-responsive products-table">
                      <Table className=" table-bordernone mb-0">
                        <thead>
                          <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Designation</th>
                            <th scope="col">Skill Level</th>
                            <th scope="col">Experience</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="bd-t-none u-s-tb">
                              <div className="align-middle image-sm-size">
                                <img
                                  className="img-radius align-top m-r-15 rounded-circle blur-up lazyloaded"
                                  src={user2}
                                  alt=""
                                  data-original-title=""
                                  title=""
                                />
                                <div className="d-inline-block">
                                  <h6>
                                    John Deo{' '}
                                    <span className="text-muted digits">
                                      (14+ Online)
                                    </span>
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td>Designer</td>
                            <td>
                              <div className="progress-showcase">
                                <div className="progress" style={{ height: 8 }}>
                                  <div
                                    className="progress-bar bg-primary"
                                    style={{ width: 30 }}
                                    role="progressbar"
                                    aria-valuenow="50"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="digits">2 Year</td>
                          </tr>
                          <tr>
                            <td className="bd-t-none u-s-tb">
                              <div className="align-middle image-sm-size">
                                <img
                                  className="img-radius align-top m-r-15 rounded-circle blur-up lazyloaded"
                                  src={user1}
                                  alt=""
                                  data-original-title=""
                                  title=""
                                />
                                <div className="d-inline-block">
                                  <h6>
                                    Holio Mako{' '}
                                    <span className="text-muted digits">
                                      (250+ Online)
                                    </span>
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td>Developer</td>
                            <td>
                              <div className="progress-showcase">
                                <div className="progress" style={{ height: 8 }}>
                                  <div
                                    className="progress-bar bg-secondary"
                                    style={{ width: 70 }}
                                    role="progressbar"
                                    aria-valuenow="50"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="digits">3 Year</td>
                          </tr>
                          <tr>
                            <td className="bd-t-none u-s-tb">
                              <div className="align-middle image-sm-size">
                                <img
                                  className="img-radius align-top m-r-15 rounded-circle blur-up lazyloaded"
                                  src={man}
                                  alt=""
                                  data-original-title=""
                                  title=""
                                />
                                <div className="d-inline-block">
                                  <h6>
                                    Mohsib lara
                                    <span className="text-muted digits">
                                      (99+ Online)
                                    </span>
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td>Tester</td>
                            <td>
                              <div className="progress-showcase">
                                <div className="progress" style={{ height: 8 }}>
                                  <div
                                    className="progress-bar bg-primary"
                                    style={{ width: 60 }}
                                    role="progressbar"
                                    aria-valuenow="50"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="digits">5 Month</td>
                          </tr>
                          <tr>
                            <td className="bd-t-none u-s-tb">
                              <div className="align-middle image-sm-size">
                                <img
                                  className="img-radius align-top m-r-15 rounded-circle blur-up lazyloaded"
                                  src={user}
                                  alt=""
                                  data-original-title=""
                                  title=""
                                />
                                <div className="d-inline-block">
                                  <h6>
                                    Hileri Soli{' '}
                                    <span className="text-muted digits">
                                      (150+ Online)
                                    </span>
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td>Designer</td>
                            <td>
                              <div className="progress-showcase">
                                <div className="progress" style={{ height: 8 }}>
                                  <div
                                    className="progress-bar bg-secondary"
                                    style={{ width: 30 }}
                                    role="progressbar"
                                    aria-valuenow="50"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="digits">3 Month</td>
                          </tr>
                          <tr>
                            <td className="bd-t-none u-s-tb">
                              <div className="align-middle image-sm-size">
                                <img
                                  className="img-radius align-top m-r-15 rounded-circle blur-up lazyloaded"
                                  src={designer}
                                  alt=""
                                  data-original-title=""
                                  title=""
                                />
                                <div className="d-inline-block">
                                  <h6>
                                    Pusiz bia{' '}
                                    <span className="text-muted digits">
                                      (14+ Online)
                                    </span>
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td>Designer</td>
                            <td>
                              <div className="progress-showcase">
                                <div className="progress" style={{ height: 8 }}>
                                  <div
                                    className="progress-bar bg-primary"
                                    role="progressbar"
                                    style={{ width: 90 }}
                                    aria-valuenow="50"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="digits">5 Year</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="12">
                <Card>
                  <CardHeader>
                    <h5>Sales Status</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col xl="3 xl-50" sm="6">
                        <div className="order-graph">
                          <h6>Orders By Location</h6>
                          <div className="chart-block chart-vertical-center">
                            <Chart
                              width={'100%'}
                              height={'180px'}
                              chartType="PieChart"
                              loader={<div>Loading Chart</div>}
                              data={[
                                ['Task', 'Hours per Day'],
                                ['Saint Lucia', 300],
                                ['Kenya', 50],
                                ['Liberia', 100],
                              ]}
                              options={doughnutOptions}
                              legend_toggle
                            />
                          </div>
                          <div className="order-graph-bottom">
                            <Media>
                              <div className="order-color-primary"></div>
                              <Media body>
                                <h6 className="mb-0">
                                  Saint Lucia{' '}
                                  <span className="pull-right">$157</span>
                                </h6>
                              </Media>
                            </Media>
                            <Media>
                              <div className="order-color-secondary"></div>
                              <Media body>
                                <h6 className="mb-0">
                                  Kenya <span className="pull-right">$347</span>
                                </h6>
                              </Media>
                            </Media>
                            <Media>
                              <div className="order-color-danger"></div>
                              <Media body>
                                <h6 className="mb-0">
                                  Liberia
                                  <span className="pull-right">$468</span>
                                </h6>
                              </Media>
                            </Media>
                            <Media>
                              <div className="order-color-warning"></div>
                              <Media body>
                                <h6 className="mb-0">
                                  Christmas Island
                                  <span className="pull-right">$742</span>
                                </h6>
                              </Media>
                            </Media>
                            <Media>
                              <div className="order-color-success"></div>
                              <Media body>
                                <h6 className="mb-0">
                                  Saint Helena{' '}
                                  <span className="pull-right">$647</span>
                                </h6>
                              </Media>
                            </Media>
                          </div>
                        </div>
                      </Col>
                      <Col xl="3 xl-50" sm="6">
                        <div className="order-graph sm-order-space">
                          <h6>Sales By Location</h6>
                          <div className="peity-chart-dashboard text-center">
                            <Chart
                              chartType="PieChart"
                              data={[
                                ['Task', 'Hours per Day'],
                                ['Saint Lucia', 300],
                                ['Kenya', 50],
                                ['Liberia', 100],
                              ]}
                              options={pieOptions}
                              graph_id="PieChart"
                              width={'100%'}
                              height={'180px'}
                              legend_toggle
                            />
                          </div>
                          <div className="order-graph-bottom sales-location">
                            <Media>
                              <div className="order-shape-primary"></div>
                              <Media body>
                                <h6 className="mb-0 mr-0">
                                  Germany{' '}
                                  <span className="pull-right">25%</span>
                                </h6>
                              </Media>
                            </Media>
                            <Media>
                              <div className="order-shape-secondary"></div>
                              <Media body>
                                <h6 className="mb-0 mr-0">
                                  Brasil <span className="pull-right">10%</span>
                                </h6>
                              </Media>
                            </Media>
                            <Media>
                              <div className="order-shape-danger"></div>
                              <Media body>
                                <h6 className="mb-0 mr-0">
                                  United Kingdom
                                  <span className="pull-right">34%</span>
                                </h6>
                              </Media>
                            </Media>
                            <Media>
                              <div className="order-shape-warning"></div>
                              <Media body>
                                <h6 className="mb-0 mr-0">
                                  Australia
                                  <span className="pull-right">5%</span>
                                </h6>
                              </Media>
                            </Media>
                            <Media>
                              <div className="order-shape-success"></div>
                              <Media body>
                                <h6 className="mb-0 mr-0">
                                  Canada <span className="pull-right">25%</span>
                                </h6>
                              </Media>
                            </Media>
                          </div>
                        </div>
                      </Col>
                      <Col xl="6 xl-100">
                        <div className="order-graph xl-space">
                          <h6>Revenue for last month</h6>
                          <div className="ct-4 flot-chart-container">
                            <Line
                              data={employeeData}
                              options={employeeOptions}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col> */}
            </Row>
          </Container>
        </>
      )}
    </Fragment>
  )
}

// javascript:void(0)

export default Dashboard
