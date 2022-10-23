import React, { Fragment, useState, useEffect } from 'react'
import Breadcrumb from './common/breadcrumb'
import { useQuery, useMutation } from '@apollo/client'
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
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap'

const GET_ORDER = gql`
  query orders {
    orders {
      createdAt
      multiorder
      id
      item_price
      wholeamount
      name
      paidstatus
      shipping_amount
      product_main_image
      keepingamount
      productid

      User {
        name
        id
      }
    }
  }
`

const Query_Reservadmin = gql`
  query reservationbyid($id: Int!) {
    reservationbyid(id: $id) {
      userId
      date
      time
      id
      tireinfo
      tiretotal
      serviceinfo
      servicetotal
      total
      adminId
      clientId
    }
  }
`

const ME_QUERY = gql`
  query me {
    me {
      id
      name
      email
    }
  }
`

const USER_QUERY = gql`
  query user($id: Int!) {
    user(id: $id) {
      phonenumber
    }
  }
`

const Orderdetail = (props) => {
  console.log('props', props.match.params.id)

  const [open, setOpen] = useState(false)
  const [resultdata, sestresultdata] = useState([])
  const [orderdata, setorderdata] = useState()
  const [orderdatadetail, setorderdatadetail] = useState()
  const [demendata, setdemendata] = useState()
  const [formState, setFormState] = useState({
    phone: '',
    users: '',
    id: '',
  })

  const { error, data: datame } = useQuery(ME_QUERY, {
    onCompleted: (datame) => {
      console.log('data!3', datame.me.id)
      setFormState({
        ...formState,
        id: datame.me.id,
      })
    },
    onError: (error) => {
      console.log('error!3', error)
    },
  })
  const { error: error212, data: data2121 } = useQuery(Query_Reservadmin, {
    variables: {
      id: Number(props.match.params.id),
    },
    onCompleted: (data2121) => {
      console.log('query com', data2121.reservationbyid)
      setorderdata(data2121.reservationbyid)
    },
    onError: (error212) => {
      console.log('error212!3', error212)
    },
  })

  var { loading, data } = useQuery(USER_QUERY, {
    variables: {
      id: Number(orderdata !== undefined ? orderdata[0]?.clientId : 0),
    },
    onCompleted: (data) => {
      console.log('dataphone.', data)
      setFormState({
        ...formState,
        phone: data?.user?.phonenumber,
      })
    },
    onError: (error) => {
      console.log('err', error)
    },
  })

  return (
    <Fragment>
      {orderdata && formState && (
        <>
          <Breadcrumb title="예약 상세" parent="Dashboard" />
          <Container fluid={true}>
            <Row>
              <Col md="12 xl-100">
                <Card>
                  <CardHeader>
                    <h5>예약 날짜 - {orderdata[0]?.date}</h5>
                    <h5>예약 시간 - {orderdata[0]?.time}</h5>
                    <h5>
                      주문번호 - {props.match.params.id}번{}
                    </h5>
                    <h5>
                      고객 전화번호 - {formState?.phone}
                      {}
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <div className="table-responsive">
                      <h4
                        style={{
                          marginTop: '30px',
                          fontWeight: 'bold',
                          color: '#6610f2',
                        }}
                      >
                        선택한 타이어{' '}
                      </h4>
                      <Table style={{ fontSize: '15px' }}>
                        {' '}
                        <thead>
                          <tr>
                            <th>이름</th>
                            <th>가격</th>
                            <th>수량</th>
                          </tr>
                        </thead>
                        <tbody>
                          {JSON.parse(orderdata[0]?.tireinfo)?.length > 0 &&
                            JSON.parse(orderdata[0]?.tireinfo)?.map(
                              (item, index) => (
                                <>
                                  {item.itemname !== 'none' ? (
                                    <tr key={index}>
                                      <td> {item.itemname}</td>
                                      <td>
                                        {' '}
                                        {Number(item.price)
                                          .toFixed(0)
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ',',
                                          ) + '원'}
                                      </td>
                                      <td> {item.number + '개'}</td>
                                    </tr>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              ),
                            )}
                        </tbody>
                        <h4
                          style={{
                            marginTop: '30px',
                            fontWeight: 'bold',
                            color: '#6610f2',
                          }}
                        >
                          타이어 합계 :{' '}
                          {Number(orderdata[0]?.tiretotal)
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                          원
                          <hr />
                        </h4>
                      </Table>
                      <h4
                        style={{
                          marginTop: '30px',
                          fontWeight: 'bold',
                          color: '#6610f2',
                        }}
                      >
                        선택한 서비스{' '}
                      </h4>
                      <Table
                        className="table mb-0"
                        style={{ fontSize: '15px' }}
                      >
                        <thead>
                          <tr>
                            <th>이름</th>
                            <th>가격</th>
                            <th>수량</th>
                          </tr>
                        </thead>
                        <tbody>
                          {JSON.parse(orderdata[0].serviceinfo)?.length > 0 &&
                            JSON.parse(orderdata[0].serviceinfo)?.map(
                              (item, index) => (
                                <>
                                  {item.itemname !== 'none' ? (
                                    <tr key={index}>
                                      <td> {item.itemname}</td>
                                      <td>
                                        {' '}
                                        {Number(item.price)
                                          .toFixed(0)
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ',',
                                          ) + '원'}
                                      </td>
                                      <td> {item.number + '개'}</td>
                                    </tr>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              ),
                            )}
                        </tbody>
                        <h4
                          style={{
                            marginTop: '30px',
                            fontWeight: 'bold',
                            color: '#6610f2',
                          }}
                        >
                          서비스 합계 :
                          {Number(orderdata[0]?.servicetotal)
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                          원
                          <hr />
                        </h4>
                        <h4
                          style={{
                            fontWeight: 'bold',
                            color: '#6610f2',
                          }}
                        >
                          총 합계 :{' '}
                          {Number(orderdata[0]?.total)
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                          원
                          <hr />
                        </h4>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </Fragment>
  )
}

// javascript:void(0)

export default Orderdetail
