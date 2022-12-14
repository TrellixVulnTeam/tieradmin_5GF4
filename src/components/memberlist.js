import React, { Fragment, useState } from 'react'
import Breadcrumb from './common/breadcrumb'
import { useQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { Link, useHistory } from 'react-router-dom'
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
      ExcelDate {
        createdAt
        datasource
      }
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

const Memberlist = () => {
  const history = useHistory()

  const [opendelete, setOpendelete] = useState(false)
  const [formState, setFormState] = useState({
    orderdata: '',
    users: '',
    userinfo: '',
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
      console.log('data1.adminusers', data1.adminusers)
      setFormState({
        ...formState,
        users: data1.adminusers,
      })
    },
    onError: (error) => {
      console.log('err', error)
    },
  })

  const [deletedatabyid, { data223, error223 }] = useMutation(DELETE_GROUP, {
    onCompleted: (data223) => {
      console.log('data222', data223)
      window.alert('?????? ??????')
      window.location.reload()
    },
    onError: (error223) => {
      console.log('error!3', error223)
      window.alert('?????? ??????')
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

  const startdeletebyidmutation = () => {
    console.log('fffff', formState.id)
    if (formState.userinfo.approved == 'no') {
      deletedatabyid({
        variables: {
          id: Number(formState.userinfo.id),
          approved: String('yes'),
        },
      })
    } else {
      deletedatabyid({
        variables: {
          id: Number(formState.userinfo.id),
          approved: String('no'),
        },
      })
    }
  }
  const startredirect = (event) => {
    event?.preventDefault()

    alert('?????? ????????? ????????????')
  }
  if (process.browser) {
    if (localStorage.getItem('businesscard') !== 'superadmin') {
      history.push('/')

      window.location.reload()
      return startredirect()
    }
  }

  return (
    <Fragment>
      {formState && (
        <>
          <Breadcrumb title="????????? ?????????" parent="Dashboard" />
          <Container fluid={true}>
            <Row>
              <Col xl="12 xl-100">
                <Card>
                  <CardHeader>
                    <h5> ?????? ????????? - ??? {formState.users.length}???</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="user-status table-responsive latest-order-table">
                      <Table borderless>
                        <thead>
                          <tr>
                            <th scope="col">?????? ??????</th>
                            <th scope="col">?????? ID</th>
                            <th scope="col">??????</th>

                            <th scope="col">?????????</th>
                            <th scope="col">??????????????????</th>

                            <th scope="col">???????????????(??????)</th>
                            <th scope="col">????????????</th>

                            <th scope="col">??????</th>
                            <th scope="col">???????????????</th>
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
                                <td>
                                  {' '}
                                  <a href={item.businesscard} target="_blank">
                                    ????????????
                                  </a>{' '}
                                </td>
                                <td>
                                  {item.approved == 'no' ? (
                                    <Button
                                      color="primary"
                                      type="button"
                                      onClick={() => onClickDelete(item)}
                                    >
                                      ?????????
                                    </Button>
                                  ) : (
                                    <Button
                                      color="secondary"
                                      type="button"
                                      onClick={() => onClickDelete(item)}
                                    >
                                      ??????
                                    </Button>
                                  )}
                                </td>
                                <td> {item?.company?.split('///')[0]}</td>
                                <td> {item?.company?.split('///')[1]}</td>
                                <td>
                                  {' '}
                                  <Link to={`/memberdetail/${item.id}`}>
                                    ????????????
                                  </Link>
                                </td>
                              </tr>
                            ))}
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
                    <>{formState.userinfo.name} ?????? ???????????????????????????????</>
                  ) : (
                    <>{formState.userinfo.name} ?????? ??????????????????????????????????</>
                  )}
                </Label>

                {/* <Input type="text"  readOnly  className="form-control" /> */}
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  color="primary"
                  onClick={() => startdeletebyidmutation()}
                >
                  ??????
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => onCloseModaldelete('VaryingMdo')}
                >
                  ??????
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

export default Memberlist
