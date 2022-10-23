import React, { Fragment, useState, useRef, useEffect } from 'react'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs'
import { User, Unlock } from 'react-feather'
import { withRouter, useHistory } from 'react-router-dom'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import { gql, useMutation } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid'
import * as AWS from 'aws-sdk'

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        email
        approved
        isadmin
        businesscard
      }
    }
  }
`

const SIGNUP_MUTATION = gql`
  mutation signup(
    $name: String
    $email: String!
    $password: String!
    $phonenumber: String!
    $company: String
    $car: String
    $carnumber: String
    $isadmin: String
    $approved: String
    $businesscard: String
  ) {
    signup(
      name: $name
      email: $email
      password: $password
      phonenumber: $phonenumber
      company: $company
      car: $car
      carnumber: $carnumber
      isadmin: $isadmin
      approved: $approved
      businesscard: $businesscard
    ) {
      token
    }
  }
`

const LoginTabset = () => {
  const history = useHistory()
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    confirmpassword: '',
    phonenumber: '',
    company: '',
    carname: 'isadmin',
    carnumber: 'isadmin',
    isadmin: 'yes',
    approved: 'no',
    businesscard: '',
    companyadd: '',
  })
  const [s3imagesforup, sets3imagesforup] = useState()
  const [check1, setcheck1] = useState(false)
  const [formStateimage, setFormStateimage] = useState([])
  console.log('formState', formState)
  const [login, { data }] = useMutation(LOGIN_MUTATION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token)
      localStorage.setItem('businesscard', data.login.user.businesscard)
      localStorage.setItem('isadmin', data.login.user.isadmin)
      localStorage.setItem('approved', data.login.user.approved)
      localStorage.setItem('id', data.login.user.id)
      window.alert('반갑습니다')

      history.push('/pages/create-page')
      window.location.reload()
    },
    onError: (error) => {
      //   console.log('error', error)
      window.alert('계정 정보를 다시 확인해주세요')
    },
  })
  var node = useRef()
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
    region: process.env.REACT_APP_S3_BUCKETREGION,
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
          const url2 = await sets3imagesforup(url)

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
        sets3imagesforup(url)
      }
    } catch (error) {
      console.log('ee', error)
      window.alert(
        '업로드 도중 오류가 발생하였습니다. 잠시 후 다시 시도 부탁드립니다.',
        error,
      )
    }
  }

  const [signup, { data1, error1 }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data1) => {
      window.alert('회원가입이 완료되었습니다')
      return window.location.reload()
    },
    onError: (error1) => {
      window.alert('이미 존재하는 이메일입니다')
      console.log('err', error1)
    },
  })

  const clickActive = (event) => {
    document.querySelector('.nav-link').classList.remove('show')
    event.target.classList.add('show')
  }

  const routeChange = () => {
    history.push(`${process.env.PUBLIC_URL}/dashboard`)
  }

  const startmutation = () => {
    login({
      variables: {
        email: String(formState.email),
        password: String(formState.password),
      },
    })
  }

  const startsignup = (e) => {
    console.log('process', process.env)
    e.preventDefault()
    if (formState.confirmpassword !== formState.password) {
      window.alert('입력하신 비밀번호가 일치하지 않습니다.')
    } else if (check1 !== true) {
      window.alert('모든 사항에 동의해야 합니다.')
    } else if (s3imagesforup == undefined) {
      window.alert('사업자등록증을 업로드해주세요')
    } else {
      signup({
        variables: {
          name: String(formState.name),
          email: String(formState.email),
          password: String(formState.password),
          phonenumber: String(formState.phonenumber),
          company:
            String(formState.company) + '///' + String(formState.companyadd),
          car: String('isadmin'),
          carnumber: String('isadmin'),
          isadmin: String(formState.isadmin),
          approved: String(formState.approved),
          businesscard: String(s3imagesforup),
        },
      })
    }
  }
  console.log('fonrm', formState)
  return (
    <div>
      <Fragment>
        <Tabs>
          <TabList className="nav nav-tabs tab-coupon">
            <Tab className="nav-link" onClick={(e) => clickActive(e)}>
              {/* <User /> */}
              로그인
            </Tab>
            <Tab className="nav-link" onClick={(e) => clickActive(e)}>
              {/* <Unlock /> */}
              회원가입
            </Tab>
          </TabList>

          <TabPanel>
            <Input
              required=""
              name="login[username]"
              type="email"
              className="form-control"
              placeholder="Username"
              id="exampleInputEmail1"
              value={formState.email}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  email: e.target.value,
                })
              }}
            />

            <Input
              required=""
              name="login[password]"
              type="password"
              className="form-control"
              placeholder="Password"
              value={formState.password}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  password: e.target.value,
                })
              }}
            />

            <div className="form-terms">
              <div className="custom-control custom-checkbox mr-sm-2">
                <Input
                  type="checkbox"
                  className="custom-control-input"
                  id="customControlAutosizing"
                />
                {/* <Label className="d-block">
                  <Input
                    className="checkbox_animated"
                    id="chk-ani2"
                    type="checkbox"
                  />
                  Reminder Me{' '}
                  <span className="pull-right">
                    {' '}
                    <a href="/#" className="btn btn-default forgot-pass p-0">
                      lost your password
                    </a>
                  </span>
                </Label> */}
              </div>
            </div>
            <div className="form-button">
              <Button
                color="primary"
                type="submit"
                onClick={() => startmutation()}
              >
                로그인
              </Button>
            </div>
          </TabPanel>
          <TabPanel>
            <Form className="form-horizontal auth-form">
              <FormGroup>
                <Input
                  required=""
                  name="login[username]"
                  type="email"
                  className="form-control"
                  placeholder="이메일"
                  id="exampleInputEmail12"
                  value={formState.email}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      email: e.target.value,
                    })
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  required=""
                  name="login[password]"
                  type="password"
                  className="form-control"
                  placeholder="비밀번호"
                  value={formState.password}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      password: e.target.value,
                    })
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  required=""
                  name="login[password]"
                  type="password"
                  className="form-control"
                  placeholder="비밀번호 확인"
                  value={formState.confirmpassword}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      confirmpassword: e.target.value,
                    })
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  required=""
                  name="login[password]"
                  type="text"
                  className="form-control"
                  placeholder="성함"
                  value={formState.name}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      name: e.target.value,
                    })
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  required=""
                  name="login[password]"
                  type="number"
                  className="form-control"
                  placeholder="전화번호(숫자만 입력)"
                  value={formState.phonenumber}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      phonenumber: e.target.value,
                    })
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  required=""
                  name="login[password]"
                  type="text"
                  className="form-control"
                  placeholder="지점 이름"
                  value={formState.company}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      company: e.target.value,
                    })
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  required=""
                  name="login[password]"
                  type="text"
                  className="form-control"
                  placeholder="지점 주소"
                  value={formState.companyadd}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      companyadd: e.target.value,
                    })
                  }}
                />
              </FormGroup>
              <div className="form-terms">
                <div className="custom-control custom-checkbox mr-sm-2">
                  <h4>사업자 등록증 업로드</h4>
                  <Input
                    className="form-control form-control-lg"
                    id="formFileLg"
                    type="file"
                    name="file"
                    multiple
                    onChange={uploadFile}
                    ref={node}
                  />
                  {s3imagesforup?.length > 0 && (
                    <div className="form-button">
                      <a
                        style={{
                          marginTop: '10px',
                          marginBottom: '40px',
                          fontSize: '20px',
                          fontWeight: 'bold',
                        }}
                        color="primary"
                        href={s3imagesforup}
                        target="_blank"
                      >
                        사업자등록증 미리보기
                      </a>
                    </div>
                  )}

                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="exampleRadios1"
                    id="exampleRadios1"
                    value="option1"
                    onChange={(e) => {
                      if (e.target.checked == true) {
                        setcheck1(true)
                      } else {
                        setcheck1(false)
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor="exampleRadios1">
                    내차타이어 <a target="_blank" href="https://tireprobuck.s3.ap-northeast-2.amazonaws.com/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2022-10-20+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+9.40.14.png">이용약관</a> 동의 (필수)
                  </label>
                </div>
              </div>

              <div className="form-button">
                <Button
                  color="primary"
                  type="submit"
                  onClick={(e) => startsignup(e)}
                >
                  회원가입
                </Button>
              </div>
            </Form>
          </TabPanel>
        </Tabs>
      </Fragment>
    </div>
  )
}

export default withRouter(LoginTabset)
