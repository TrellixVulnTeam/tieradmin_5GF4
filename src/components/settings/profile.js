import React, { Fragment } from "react";

import designer from "../../assets/images/dashboard/designer.jpg";
import TabsetProfile from "./tabset-profile";
import Breadcrumb from "../common/breadcrumb";
import { Card, CardBody, Col, Container, Media, Row, Button } from "reactstrap";


const Profile = () => {
	return (
		<Fragment>
			<Breadcrumb title="Profile" parent="Settings" />
			<Container fluid={true}>
				<Row>
					
					<Col xl="12">
						<Card className="profile-card">
							<CardBody>
								<TabsetProfile />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default Profile;
