import React, { Fragment, useEffect, useState } from 'react'
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
  Col,
  Container,
  Media,
  Row,
  Table,
  Button,
  ModalBody,
  CardTitle,
  CardHeader,
  ModalFooter,
  Modal,
  Label,
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
  query adminusers {
    adminusers {
      id
      createdAt
      name
      email
      businesscard
      approved
      company
    }
  }
`

const DELETE_GROUP = gql`
  mutation changeuserapprove($id: Int!, $approved: String) {
    changeuserapprove(id: $id, approved: $approved) {
      id
    }
  }
`
const GET_USERBYID = gql`
  mutation userbyid($id: Int!) {
    userbyid(id: $id) {
      id
      name
      company
    }
  }
`

const Memberdetail = (props) => {
  console.log('props', props.match.params.id)

  const [opendelete, setOpendelete] = useState(false)
  const [formState, setFormState] = useState({
    orderdata: '',
    users: '',
    userinfo: '',
    adminid: '',
    adminuserinfo: '',
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
        users: data1.adminusers,
      })
    },
    onError: (error) => {
      console.log('err', error)
    },
  })

  const [getuserbyid, { data2231, error2231 }] = useMutation(GET_USERBYID, {
    onCompleted: (data2231) => {
      setFormState({
        ...formState,
        adminuserinfo: data2231.userbyid,
      })
    },
    onError: (error223) => {
      console.log('error!3', error2231)
      window.alert('에러 발생')
    },
  })
  const onCloseModaldelete = () => {
    setOpendelete(false)
  }

  const onClickDelete = (user) => {
    console.log('user', user)
    setFormState({
      ...formState,
      userinfo: user,
    })
    setOpendelete(true)

    // setdeletedata(user)
    // setDeleteModal(true)
  }
  console.log('ddd', formState)
  useEffect(() => {
    if (Number(props.match.params.id) > 0) {
      getuserbyid({
        variables: {
          id: Number(props.match.params.id),
        },
      })
    }
  }, [props.match.params.id])

  return (
    <Fragment>
      {formState && (
        <>
          <Breadcrumb title="상세 데이터" parent="Dashboard" />
          <Container fluid={true}>
            <Row>
              <Col xl="12 xl-100">
                <Card>
                  <CardHeader>
                    <h5> 성함 - {formState.adminuserinfo?.name}</h5>

                    <h5> 사업자 명 - {formState.adminuserinfo?.company?.split('///')[0]}</h5>
                    <h5> 사업자 주소 - {formState.adminuserinfo?.company?.split('///')[1]}</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="user-status table-responsive latest-order-table">
                      <Table borderless>
                        <thead>
                          <tr>
                            <th scope="col">데이터 보기</th>

                            <th scope="col">엑셀 업로드</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {' '}
                              <Link
                                className="btn btn-secondary"
                                to={`/paidorderlistdetail/${formState?.adminuserinfo?.id}`}
                              >
                                상세보기
                              </Link>
                            </td>
                            <td>
                              {' '}
                              <Link
                                className="btn btn-secondary"
                                to={`/pages/create-exceldetail/${formState?.adminuserinfo?.id}`}
                              >
                                상세보기
                              </Link>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      )}
      <>
        {formState && (
          <>
            <Modal
              isOpen={opendelete}
              toggle={onCloseModaldelete}
              style={{ overlay: { opacity: 0.1 } }}
            >
              <ModalBody>
                <Label htmlFor="recipient-name" className="col-form-label">
                  {formState.userinfo.approved == 'no' ? (
                    <>{formState.userinfo.name} 님을 활성화시키시겠습니까?</>
                  ) : (
                    <>{formState.userinfo.name} 님을 비활성화시키시겠습니까?</>
                  )}
                </Label>

                {/* <Input type="text"  readOnly  className="form-control" /> */}
              </ModalBody>
              <ModalFooter>
                <Button type="button" color="primary">
                  변경
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => onCloseModaldelete('VaryingMdo')}
                >
                  닫기
                </Button>
              </ModalFooter>
            </Modal>
          </>
        )}
      </>
    </Fragment>
  )
}

// javascript:void(0)

export default Memberdetail
