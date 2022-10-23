import React, { Fragment, useState, useEffect, useRef } from 'react'
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap'
import classnames from 'classnames'
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory from 'react-bootstrap-table2-editor'

// const GET_EXCEL = gql`
//   query excelData {
//     excelData {
//       id
//       createdAt
//       datasource
//     }
//   }
// `
const GET_EXCEL = gql`
  query excelDatabyadminid($adminId: Int) {
    excelDatabyadminid(adminId: $adminId) {
      id
      createdAt
      datasource
    }
  }
`

const GET_ORDER = gql`
  query paidorders {
    paidorders {
      id
      createdAt
      wholeamount
      userId
      title
      category
      price
      discount
      images
      updated_at
      productid
      wholeamount
      keepingamount
      shipping_amount
      orderstatus
      User {
        id
        email
        name
      }
    }
  }
`

const ORDER_MUTATION = gql`
  mutation updateOrder($id: Int!, $paidstatus: String!) {
    updateOrder(id: $id, paidstatus: $paidstatus) {
      id
    }
  }
`

const PAID_ORDER_MUTATION = gql`
  mutation createPaidorderlist(
    $userId: Int!
    $productid: Int!
    $title: String!
    $category: String!
    $price: String!
    $discount: String!
    $images: String!
    $wholeamount: String!
    $keepingamount: String!
    $shipping_amount: String!
    $updated_at: String!
    $orderstatus: String!
  ) {
    createPaidorderlist(
      userId: $userId
      productid: $productid
      title: $title
      category: $category
      price: $price
      discount: $discount
      images: $images
      wholeamount: $wholeamount
      keepingamount: $keepingamount
      shipping_amount: $shipping_amount
      updated_at: $updated_at
      orderstatus: $orderstatus
    ) {
      id
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
const Paidorderlist = () => {
  var node = useRef()
  const [open, setOpen] = useState(false)
  const [exceldatasource, setexceldatasource] = useState()

  const [orderdata, setorderdata] = useState()
  const [orderdatadetail, setorderdatadetail] = useState()
  const [demendata, setdemendata] = useState()
  const [currentActiveTab, setCurrentActiveTab] = useState('0')
  const [tabledate, settabledate] = useState()
  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab)
  }

  const [formState, setFormState] = useState({
    orderdata: '',
    users: '',
    id: '',
  })

  useEffect(() => {
    console.log('exceldatasource', exceldatasource)
  }, [exceldatasource])

  var { loading, data } = useQuery(GET_ORDER, {
    onCompleted: (data) => {
      console.log('data.', data.paidorders)
      setFormState({
        ...formState,
        orderdata: data.paidorders,
      })
    },
    onError: (error) => {
      console.log('err', error)
    },
  })

  // var { loading, data } = useQuery(GET_EXCEL, {
  //   onCompleted: (data) => {
  //     if (data.excelData[0].datasource) {
  //       setexceldatasource(JSON.parse(data.excelData[0].datasource))
  //     }
  //   },
  //   onError: (error) => {
  //     console.log('err', error)
  //   },
  // })
  var { loading, data } = useQuery(GET_EXCEL, {
    variables: {
      adminId: Number(formState.id),
    },
    onCompleted: (data) => {
      console.log('excelData', data)
      if (data.excelDatabyadminid[0]?.datasource) {
        setexceldatasource(JSON.parse(data.excelDatabyadminid[0].datasource))
      }
    },
    onError: (error) => {
      console.log('err', error)
    },
  })
  const onOpenModal = () => {
    setOpen(true)
  }

  const { errorme, datame } = useQuery(ME_QUERY, {
    onCompleted: (datame) => {
      console.log('data!3', datame.me.id)
      setFormState({
        ...formState,
        id: datame.me.id,
      })
    },
    onError: (errorme) => {
      console.log('error!3', errorme)
    },
  })

  const onCloseModal = () => {
    setOpen(false)
  }

  const handledemend = (arg) => {
    console.log('art,', arg)
    setdemendata(arg)
    if (arg.multiorder.length > 2) {
      setorderdatadetail(JSON.parse(arg.multiorder))
      console.log('data1', JSON.parse(arg.multiorder))
    } else {
      console.log('data2', arg.length)
      setorderdatadetail(arg)
    }

    setOpen(true)
  }

  const [ordercreated, { data: updatedata, error: errordata }] = useMutation(
    ORDER_MUTATION,
    {
      onCompleted: (updatedata) => {
        // window.alert('업데이트가 완료되었습니다')
        // window.location.reload()

        if (orderdatadetail?.length !== undefined) {
          for (let i = 0; i < orderdatadetail?.length; i++) {
            paidordercreated({
              variables: {
                userId: Number(demendata.User.id),
                productid: Number(orderdatadetail[i].id),
                title: String(orderdatadetail[i].title),
                category: String('cate'),
                price: String(orderdatadetail[i].price),
                discount: String(orderdatadetail[i].price),
                images: String(orderdatadetail[i].images),
                wholeamount: String(orderdatadetail[i].qty),
                keepingamount: String(orderdatadetail[i].qtyforkeep),
                shipping_amount: String(
                  Number(orderdatadetail[i].qty) -
                    Number(orderdatadetail[i].qtyforkeep),
                ),
                updated_at: String(Date.now()),
                orderstatus: String('배송준비'),
              },
            })

            // if (e.target.files.length - 1 == i) {
            //   return
            // }
          }
        } else {
          paidordercreated({
            variables: {
              userId: Number(orderdatadetail.User.id),
              productid: Number(orderdatadetail.productid),
              title: String(orderdatadetail.name),
              category: String(orderdatadetail.name),
              price: String(orderdatadetail.item_price),
              discount: String(orderdatadetail.item_price),
              images: String(orderdatadetail.product_main_image),
              wholeamount: String(orderdatadetail.wholeamount),
              keepingamount: String(orderdatadetail.keepingamount),
              shipping_amount: String(orderdatadetail.shipping_amount),
              updated_at: String(Date.now()),
              orderstatus: String('배송준비'),
            },
          })
        }
      },
      onError: (errordata) => {
        window.alert('에러 발생')
        console.log('err', errordata)
      },
    },
  )

  const [paidordercreated, { data: updatedata1, error: errordata1 }] =
    useMutation(PAID_ORDER_MUTATION, {
      onCompleted: (updatedata1) => {
        window.alert('업데이트가 완료되었습니다')
        window.location.reload()
      },
      onError: (errordata1) => {
        window.alert('에러 발생')
        console.log('err', errordata)
      },
    })

  const startupdatemutationfordemend = () => {
    console.log('demendata', demendata)

    if (demendata !== null) {
      if (demendata.paidstatus == 'no') {
        ordercreated({
          variables: {
            id: Number(demendata.id),
            paidstatus: String('yes'),
          },
        })
      } else {
        ordercreated({
          variables: {
            id: Number(demendata.id),
            paidstatus: String('no'),
          },
        })
      }
    }
  }

  const contactListColumns = [
    {
      text: 'id',
      dataField: 'id',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '코드',
      dataField: '코드',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '이름',
      dataField: '이름',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '가격',
      dataField: '가격',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '할인율',
      dataField: '할인율',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '그룹',
      dataField: '그룹',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
  ]

  const beforeSaveCell = (oldValue, newValue, row, column) => {
    console.log('dcccc', oldValue)
    console.log('dcccc', newValue)
    console.log('dcccc', row)
    console.log('dcccc', column)
    if (isNaN(newValue)) {
      return {
        valid: false,
      }
    } else if (newValue == oldValue) {
      console.log('같은 값', row)
    } else {
      console.log('성공', row)
    }
  }

  return (
    <Fragment>
      <Breadcrumb title="데이터 보기" parent="Dashboard" />
      <Container fluid={true}>
        <Row>
          <Col xl="12 xl-100">
            <Card>
              <CardHeader>
                <h5>아이템 목록</h5>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: 'block',
                    // width: 700,
                    // padding: 30,
                    cursor: 'pointer',
                  }}
                >
                  <br />
                  <h4>엑셀 미리보기</h4>

                  <br />
                  <>
                    <Nav tabs>
                      {exceldatasource &&
                        exceldatasource.map((item, index) => (
                          <NavItem key={index}>
                            <NavLink
                              className={classnames({
                                active: currentActiveTab === index,
                              })}
                              onClick={() => {
                                toggle(index)
                                settabledate(item.밸류)
                                console.log('ddddd', index)
                              }}
                            >
                              {item.셀이름}
                            </NavLink>
                          </NavItem>
                        ))}
                    </Nav>
                    <TabContent activeTab={currentActiveTab}>
                      {exceldatasource &&
                        exceldatasource.map((item, index) => (
                          <TabPane tabId={index} key={index}>
                            <Row>
                              <Col sm="12">
                                <br />
                                <h5>엑셀내용 상세</h5>

                                <br />
                                {tabledate && (
                                  <PaginationProvider
                                    pagination={paginationFactory({
                                      sizePerPage: 500,
                                      totalSize: tabledate.length, // replace later with size(users),
                                      custom: true,
                                    })}
                                    keyField={'id'}
                                    columns={contactListColumns}
                                    data={tabledate}
                                  >
                                    {({
                                      paginationProps,
                                      paginationTableProps,
                                    }) => {
                                      return (
                                        <ToolkitProvider
                                          keyField={'id'}
                                          data={tabledate}
                                          columns={contactListColumns}
                                          bootstrap4
                                          search
                                        >
                                          {(toolkitProps) => (
                                            <React.Fragment>
                                              <Row className="mb-2">
                                                <Col sm="4">
                                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                                    <div className="position-relative">
                                                      {/* <SearchBar
                                                  {...toolkitProps.searchProps}
                                                /> */}
                                                      {`총 갯수 =  ${
                                                        tabledate.length - 1
                                                      }개`}

                                                      <i className="bx bx-search-alt search-icon" />
                                                    </div>
                                                  </div>
                                                </Col>
                                                <Col sm="8"></Col>
                                              </Row>
                                              <Row>
                                                <Col xl="12">
                                                  <div className="table-responsive">
                                                    <BootstrapTable
                                                      keyField={'id'}
                                                      {...toolkitProps.baseProps}
                                                      {...paginationTableProps}
                                                      defaultSorted={[
                                                        {
                                                          dataField: 'id', // if dataField is not match to any column you defined, it will be ignored.
                                                          order: 'desc', // desc or asc
                                                        },
                                                      ]}
                                                      classes={
                                                        'table align-middle table-bordered table-hover text-centered'
                                                      }
                                                      bordered={false}
                                                      striped={false}
                                                      responsive
                                                      ref={node}
                                                    />
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                  <PaginationListStandalone
                                                    {...paginationProps}
                                                  />
                                                </Col>
                                              </Row>
                                              ,
                                            </React.Fragment>
                                          )}
                                        </ToolkitProvider>
                                      )
                                    }}
                                  </PaginationProvider>
                                )}
                              </Col>
                              {/* <Button
                          color="primary"
                          type="button"
                          onClick={() => startmutation()}
                        >
                          저장하기
                        </Button> */}
                            </Row>
                          </TabPane>
                        ))}
                    </TabContent>
                  </>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

// javascript:void(0)

export default Paidorderlist
