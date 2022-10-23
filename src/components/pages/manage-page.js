import React, { useEffect, useState, useRef } from 'react'
import { map, _ } from 'lodash'
import MetaTags from 'react-meta-tags'
import * as AWS from 'aws-sdk'
// import XLSX from 'xlsx'
import * as XLSX from 'xlsx'
import Breadcrumb from '../common/breadcrumb'
import { v4 as uuidv4 } from 'uuid'
import 'antd/dist/antd.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'flatpickr/dist/themes/material_blue.css'
import DatePicker, { registerLocale } from 'react-datepicker'

import Flatpickr from 'react-flatpickr'
import ko from 'date-fns/locale/ko' // 한국어적용

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Input,
  Label,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  ModalHeader,
  ModalBody,
  CardTitle,
  CardHeader,
  ModalFooter,
  Modal,
  FormGroup,
} from 'reactstrap'

import { Editor } from '@tinymce/tinymce-react'
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'
import { gql, useMutation, useQuery, useLazyQuery } from '@apollo/client'
import { TimePicker } from 'antd'
import moment from 'moment'

const format = 'HH:mm'

registerLocale('ko', ko) // 한국어적용
const UPDATE_SELLING = gql`
  mutation createTermsanduse($contents: String) {
    createTermsanduse(contents: $contents) {
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
const Query_Reserv = gql`
  query reservationbydate($date: String, $userId: Int) {
    reservationbydate(date: $date, userId: $userId) {
      userId
      date
      time
      id
    }
  }
`

const Create_Reserv = gql`
  mutation createReservation(
    $time: String
    $status: String
    $date: String
    $reservationdetail: String
  ) {
    createReservation(
      time: $time
      status: $status
      date: $date
      reservationdetail: $reservationdetail
    ) {
      id
    }
  }
`
const CREACT_PRODUCT_MUTATION = gql`
  mutation createProduct(
    $title: String
    $description: String
    $type: String
    $brand: String
    $category: String
    $price: Int
    $newproduct: String
    $sale: String
    $stock: String
    $discount: Int
    $variants: String
    $images: String
    $userId: Int
    $productpageId: Int
  ) {
    createProduct(
      title: $title
      description: $description
      type: $type
      brand: $brand
      category: $category
      price: $price
      newproduct: $newproduct
      sale: $sale
      stock: $stock
      discount: $discount
      variants: $variants
      images: $images
      userId: $userId
      productpageId: $productpageId
    ) {
      userId
    }
  }
`
const DELETE_GROUP = gql`
  mutation deleteReservationbyid($id: Int!) {
    deleteReservationbyid(id: $id) {
      id
    }
  }
`

const Manage_page = (props) => {
  const [finaldate, setfinaldate] = useState()
  const [finalTime, setfinalTime] = useState()
  const [endDate, setendDate] = useState(new Date())
  const [endDatetostr, setendDatetostr] = useState(new Date())
  const handleEndDate = (date) => {
    setendDate(date)
    console.log('reatlendDate', moment(new Date(date)).format('YYYY-MM-DD'))
    setFormState({
      ...formState,
      date: new Date().toDateString(),
    })
  }

  useEffect(() => {
    setfinaldate(moment(new Date(endDate)).format('YYYY-MM-DD'))
  }, [endDate])

  var node = useRef()
  const [opendelete, setOpendelete] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [testarr, settestarr] = useState([])
  const [collectsource, setcollectsource] = useState('not selected')
  const [activeTab, setActiveTab] = useState('0')
  const [contentvalue, setcontentvalue] = useState('')
  const [imageCenterModal, setImageCenterModal] = useState(false)
  const [s3imagesforup, sets3imagesforup] = useState([])
  const [formStateimage, setFormStateimage] = useState([])
  const [status, setstatus] = useState()
  const [exceldata, setexceldata] = useState()
  const [cols, setcols] = useState()
  const [alreadyBooked, setalreadyBooked] = useState()

  const [value, setValue] = useState()

  const onChangereserv = (time) => {
    var resultreserv1
    var resultreserv2
    var resultreserv3
    setValue(time)
    setfinalTime(moment(new Date(time._d)).format('HH:mm'))
  }

  const [formState, setFormState] = useState({
    id: 0,
    productImages: [],
    descriptionHTMLContent: '',
    title: '',
    description: '',
    type: '',
    brand: '',
    category: '',
    price: 0,
    newproduct: '',
    sale: '',
    stock: '',
    discount: 0,
    variants: '',
    images: '',
    userId: 0,
    productpageId: 0,
    time: '9시',
    status: '',
    date: '',
    reservationdetail: '',
    deleteid: 0,
  })

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
      text: '날짜',
      dataField: 'date',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '시간',
      dataField: 'time',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },

    {
      text: '삭제',
      dataField: '할인율',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
      formatter: (cellContent, user) => (
        <div className="d-flex gap-3">
          <Button
            color="primary"
            type="button"
            onClick={() => onClickDelete(user)}
          >
            삭제하기
          </Button>
        </div>
      ),
    },
  ]

  const {
    loading,
    error: error212,
    data: data2121,
  } = useQuery(Query_Reserv, {
    variables: {
      date: String(finaldate),
      userId: Number(formState.id),
    },
    onCompleted: (data2121) => {
    
        setalreadyBooked(data2121.reservationbydate)
        console.log('query com', data2121.reservationbydate)
      
    },
    onError: (error212) => {
      console.log('error212!3', error212)
    },
  })

  const [imageCenterFormState, setImageCenterFormState] = useState({
    startDate: null,
    endDate: null,
    page: 1,
    size: 20,
    selectedIds: [],
  })
  const [restime, setrestime] = useState('9시')
  const handleFile = (file /*:File*/) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader()
    const rABS = !!reader.readAsBinaryString
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' })
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      console.log(rABS, wb)
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
      /* Update state */
      // this.setState({ data: data, cols: make_cols(ws['!ref']) })
      setexceldata(data)
      setcols(make_cols(ws['!ref']))
    }
    if (rABS) reader.readAsBinaryString(file)
    else reader.readAsArrayBuffer(file)
  }

  const handleChange = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const make_cols = (refstr) => {
    let o = [],
      C = XLSX.utils.decode_range(refstr).e.c + 1
    for (var i = 0; i < C; ++i)
      o[i] = { name: XLSX.utils.encode_col(i), key: i }
    return o
  }

  const onClickDelete = (user) => {
    console.log('user', user)
    setFormState({
      ...formState,
      deleteid: user.id,
      date: user.date,
      time: user.time,
    })
    setOpendelete(true)

    // setdeletedata(user)
    // setDeleteModal(true)
  }

  const [deletedatabyid, { data223, error223 }] = useMutation(DELETE_GROUP, {
    onCompleted: (data223) => {
      console.log('data222', data223)
      window.alert('삭제 완료')
      window.location.reload()
    },
    onError: (error223) => console.log('error!3', error223),
  })

  const startdeletebyidmutation = () => {
    console.log('fffff', formState.deleteid)
    deletedatabyid({
      variables: {
        id: Number(formState.deleteid),
      },
    })
  }

  const { error, data } = useQuery(ME_QUERY, {
    onCompleted: (data) => {
      console.log('data!3', data.me.id)
      setFormState({
        ...formState,
        id: data.me.id,
      })
    },
    onError: (error) => {
      console.log('error!3', error)
    },
  })
  const onCloseModaldelete = () => {
    setOpendelete(false)
  }
  const [createsellingmutation, { data2, error2 }] = useMutation(
    UPDATE_SELLING,
    {
      onCompleted: (data2) => {
        window.alert('업데이트 완료')
        window.location.reload()
      },
      onError: (error2) => console.log('error!3', error2),
    },
  )

  const [productCReate] = useMutation(CREACT_PRODUCT_MUTATION, {
    onError: (error5) => {
      console.log('error5', error5)

      // window.location.reload();
    },
    onCompleted: (data5) => {
      console.log('data5', data5)
    },
  })

  const startmutation = () => {
    createsellingmutation({
      variables: {
        contents: formState.descriptionHTMLContent,
      },
    })
  }
  const [createRerv, { data21, error21 }] = useMutation(Create_Reserv, {
    onCompleted: (data21) => {
      window.alert('예약생성 완료')
      window.location.reload()
    },
    onError: (error21) => {
      if (error21.message == '이미 존재합니다') {
        window.alert('이미 예약된 시간입니다.')
      } else {
        window.alert('오류발생. 잠시 후 다시 시도해주세요')
        window.location.reload()
      }
    },
  })

  const startmutationreserv = () => {
    createRerv({
      variables: {
        time: String(finalTime),
        status: String('yes'),
        date: String(finaldate),
        reservationdetail: String(formState.reservationdetail),
      },
    })
  }

  const startcreateproductmutation = () => {
    console.log('formstate11', formState)
    productCReate({
      variables: {
        title: String(formState.title),
        description: String(formState.descriptionHTMLContent),
        type: 'none',
        brand: String(formState.brand),
        category: String(formState.category),
        price: Number(formState.price),
        newproduct: 'none',
        sale: String(formState.sale),
        stock: String(formState.stock),
        discount: Number(formState.discount),
        variants: String(formState.variants),
        images: JSON.stringify(s3imagesforup),
        userId: Number(formState.id),
        productpageId: 1,
      },
    })
  }

  useEffect(() => {
    console.log('s3imagesforup', s3imagesforup)
  }, [s3imagesforup])

  const config = {
    bucketName: process.env.REACT_APP_S3_BUCKETNAME,
    region: process.env.REACT_APP_S3_BUCKETREGION,
    // accessKeyId: process.env.REACT_S3_ACCESSKEYID,
    accessKeyId: process.env.REACT_APP_S3_ACCESSKEYID,
    secretAccessKey: process.env.REACT_APP_S3_SECRETACCESSKEY,
  }

  const s3 = new AWS.S3({
    region: process.env.REACT_APP_S3_BUCKETNAME,
    accessKeyId: process.env.REACT_APP_S3_ACCESSKEYID,
    secretAccessKey: process.env.REACT_APP_S3_SECRETACCESSKEY,
  })

  const uploadToS3 = async (data) => {
    let name = uuidv4() + '.' + data.type.substring(6)
    console.log('sdfsdf', data.name)
    await s3
      .putObject({
        Key: name,
        Bucket: 'tireprobuck',
        // ContentType: "image/jpeg",
        ContentType: data.type,
        Body: data,
        ACL: 'public-read',
      })
      .promise()
    return `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${name}`
  }

  const uploadFile = async (e) => {
    console.log('dfsdf', process.env)
    try {
      if (e.target.files.length > 0) {
        for (let i = 0; i < e.target.files.length; i++) {
          // uploadFile1(s3images1[i], s3images1[i]);
          const url = await uploadToS3(e.target.files[i])
          const url2 = await sets3imagesforup((prevImages) =>
            prevImages.concat(url),
          )
          const urlbefore = await [
            {
              fileName: e.target.files[i].name,
              image: url,
              id: uuidv4() + '.' + e.target.files[i].type.substring(6),
            },
          ]
          const url3 = await setFormStateimage((formStateimage) =>
            formStateimage.concat(urlbefore),
          )
          if (e.target.files.length - 1 == i) {
            return
          }
        }
      } else {
        const url = await uploadToS3(e.target.files[0])
        console.log('url', url)
        sets3imagesforup((prevImages) => prevImages.concat(url))
      }

      // const url = await uploadToS3(e.target.files[0])
      // console.log("url", url)
      // sets3imagesforup((prevImages) => prevImages.concat(url));
      // res = ""
    } catch (error) {
      console.log('ee', error)
      window.alert(
        '업로드 도중 오류가 발생하였습니다. 잠시 후 다시 시도 부탁드립니다.',
        error,
      )
    }
  }

  console.log(formState, 'formstart')
  return (
    <React.Fragment>
      <div className="page-content">
        {/* <h2>캘린더를 선택 후 날짜 선택, 예약 시간 선택 후 생성</h2> */}
        {/* Render Breadcrumb */}
        <Col xs={12}>
          <Card>
            <CardBody style={{ height: '200px' }}>
              <h3 style={{ marginTop: '90px' }} className="card-title">
                예약 관리
              </h3>
              <p className="card-title-desc">
                캘린더를 선택 후 날짜 선택 후 예약을 관리해주세요.
              </p>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12}>
          <Card>
            <CardBody>
              <h4 className="card-title">날짜 선택</h4>
              <p className="card-title-desc">클릭하여 날짜를 선택해주세요</p>

              <Form>
                <DatePicker
                  locale={ko}
                  dateFormat="yyyy.MM.dd"
                  selected={endDate}
                  endDate={endDate}
                  onChange={handleEndDate}
                  placeholderText="Weeks start on Monday"
                  // onChange={(date) => setStartDate(date)}
                />
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12}>
          <Card>
            <CardBody>
              <h4 className="card-title">예약된 시간</h4>

              <div className="form-group mb-0">
                <label>
                  현재 선택된 날짜 :
                  <span style={{ color: 'red' }}> {finaldate}</span>
                </label>
              </div>
              <div className="form-group mb-0">
                {alreadyBooked?.length > 0 ? (
                  <>
                    <PaginationProvider
                      pagination={paginationFactory({
                        sizePerPage: 500,
                        totalSize: alreadyBooked.length, // replace later with size(users),
                        custom: true,
                      })}
                      keyField={'id'}
                      columns={contactListColumns}
                      data={alreadyBooked}
                    >
                      {({ paginationProps, paginationTableProps }) => {
                        return (
                          <ToolkitProvider
                            keyField={'id'}
                            data={alreadyBooked}
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
                                        {`총 예약 갯수 : ${alreadyBooked.length}개`}

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
                  </>
                ) : (
                  <>
                    {' '}
                    <span style={{ color: 'red' }}>
                      {' '}
                      예약된 시간이 없습니다.
                    </span>{' '}
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* <CardHeader style={{ backgroundColor: "#5e72e4" }}> */}

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
                    {formState.date} - {formState.time} 을(를) 삭제하시겠습니까?
                  </Label>

                  {/* <Input type="text"  readOnly  className="form-control" /> */}
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="button"
                    color="primary"
                    onClick={() => startdeletebyidmutation()}
                  >
                    삭제
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
      </div>
    </React.Fragment>
  )
}

export default Manage_page
