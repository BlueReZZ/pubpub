import React, { useState } from 'react';
import {
	Button,
	InputGroup,
	Checkbox,
	Position,
	Popover,
	PopoverInteractionKind,
} from '@blueprintjs/core';
import { GridWrapper } from 'components';
import Icon from 'components/Icon/Icon';
import { apiFetch, generateSocialItems } from 'utils';
import { usePageContext } from 'utils/hooks';

require('./footer.scss');

const Footer = () => {
	const [email, setEmail] = useState('');
	const [isLoadingSubscribe, setIsLoadingSubscribe] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const { locationData, communityData, scopeData } = usePageContext();
	const links = locationData.isBasePubPub
		? [
				{ id: 1, title: 'Create your community', url: '/create/community' },
				{ id: 2, title: 'Login', url: '/login' },
				{ id: 3, title: 'Signup', url: '/signup' },
				{ id: 4, title: 'Terms', url: '/tos' },
				// { id: 6, title: 'Help', url: 'https://meta.pubpub.org/help' },
		  ]
		: [
				{ id: 1, title: 'Dashboard', url: '/dashboard', adminOnly: true },
				{ id: 2, title: 'RSS', url: '/rss.xml' },
				{ id: 3, title: 'Terms', url: '/tos' },
				// { id: 6, title: 'Help', url: 'https://meta.pubpub.org/help' },
		  ];

	const pubpubLogo =
		communityData.headerColorType === 'light'
			? '/static/logoBlack.svg'
			: '/static/logoWhite.svg';
	const wrapperClasses = locationData.isBasePubPub
		? 'base-pubpub'
		: 'accent-background accent-color';
	const socialItems = locationData.isBasePubPub
		? [
				{
					id: 'si-1',
					icon: <Icon icon="twitter" />,
					title: 'Twitter',
					value: 'pubpub',
					url: 'https://twitter.com/pubpub',
				},
				{
					id: 'si-2',
					icon: <Icon icon="github" />,
					title: 'Github',
					value: 'pubpub',
					url: 'https://github.com/pubpub',
				},
				{
					id: 'si-3',
					icon: <Icon icon="envelope" />,
					title: 'Contact by email',
					value: 'hello@pubpub.org',
					url: 'mailto:hello@pubpub.org?subject=Contact',
				},
		  ]
		: generateSocialItems(communityData);
	const handleEmailSubmit = (evt) => {
		evt.preventDefault();
		setIsLoadingSubscribe(true);

		if (!isConfirmed) {
			setIsLoadingSubscribe(false);
			return false;
		}
		return apiFetch('/api/subscribe', {
			method: 'POST',
			body: JSON.stringify({
				email: email,
			}),
		})
			.then(() => {
				setIsLoadingSubscribe(false);
				setEmail('');
				setIsSubscribed(true);
			})
			.catch((err) => {
				console.error(err);
				setIsLoadingSubscribe(false);
			});
	};
	return (
		<div className={`footer-component ${wrapperClasses}`}>
			<GridWrapper>
				<div className="left">
					<div className="title">
						<a href="https://pubpub.org">
							<img className="logo" src={pubpubLogo} alt="PubPub logo" />
						</a>
						<ul className="social-list">
							<li>
								<a href="https://twitter.com/pubpub">
									<Icon icon="twitter" />
								</a>
							</li>
							<li>
								<a href="mailto:hello@pubpub.org?subject=Contact">
									<Icon icon="envelope" />
								</a>
							</li>
							<li>
								<a href="https://github.com/pubpub">
									<Icon icon="github" />
								</a>
							</li>
						</ul>
					</div>
					<ul className="separated">
						<li>
							<a href="https://pubpub.org/about">About</a>
						</li>
						<li>
							<a href="https://pubpub.org/explore">Explore</a>
						</li>
						<li>
							<a href="https://pubpub.org/pricing">Pricing</a>
						</li>
						<li>
							<a href="https://help.pubpub.org">Help</a>
						</li>
					</ul>

					<form onSubmit={handleEmailSubmit}>
						<strong>Feature & Community Newsletter</strong>
						<InputGroup
							type="email"
							placeholder="Your Email"
							value={email}
							onChange={(evt) => {
								setEmail(evt.target.value);
							}}
							label="Feature & community newsletter"
							rightElement={
								<Button
									type="submit"
									icon={!isSubscribed ? 'arrow-right' : 'tick'}
									minimal={true}
									loading={isLoadingSubscribe}
								/>
							}
							disabled={isSubscribed}
						/>
						<div className="confirm">
							<Checkbox
								checked={isConfirmed}
								disabled={isSubscribed}
								required="required"
								onChange={(evt) => {
									setIsConfirmed(evt.target.checked);
								}}
								label={
									<span>
										<Popover
											interactionKind={PopoverInteractionKind.HOVER}
											popoverClassName="bp3-popover-content-sizing"
											position={Position.RIGHT}
										>
											<p>
												<em>I agree to receive this newsletter.</em>
											</p>
											<div>
												<p>
													We use a third party provider, Mailchimp, to
													deliver our newsletters. We never share your
													data with anyone, and you can unsubscribe using
													the link at the bottom of every email. Learn
													more by visiting your&nbsp;
													<a href="/privacy">privacy settings</a>.
												</p>
											</div>
										</Popover>
									</span>
								}
							/>
						</div>
					</form>
				</div>
				<div className="right">
					<div className="title">
						<a href="/">{communityData.title}</a>
					</div>
					<ul className="separated">
						{links
							.filter((item) => {
								return (
									!item.adminOnly || scopeData.activePermissions.canAdminCommunity
								);
							})
							.map((link) => {
								return (
									<li key={`footer-item-${link.id}`}>
										<a href={link.url}>{link.title}</a>
									</li>
								);
							})}
					</ul>
					{!!socialItems.length && (
						<ul className="social-list">
							{socialItems.map((item) => {
								return (
									<a href={item.url} key={`social-item-${item.id}`}>
										<li>{item.icon}</li>
									</a>
								);
							})}
						</ul>
					)}
				</div>
			</GridWrapper>
		</div>
	);
};

export default Footer;
