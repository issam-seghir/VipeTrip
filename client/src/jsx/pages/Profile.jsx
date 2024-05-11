import { CreatePostWidget } from "@components/CreatePostWidget";
import { UserPosts } from "@components/UserPosts";
import { useGetCurrentUserQuery, useGetUserQuery } from "@jsx/store/api/userApi";
import { toTitleCase } from "@jsx/utils";
import { selectCurrentUser } from "@store/slices/authSlice";
import { format } from "date-fns";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export function Profile() {
	const { profileId } = useParams();
	const { id: currentUserId } = useSelector(selectCurrentUser);
	const isCurrentUser = currentUserId === profileId;
	const imgPrevRef = useRef(null);
	const {
		data: currentUser,
		isFetching: isCurrentUserFetching,
		isLoading: isCurrentUserLoading,
		isError: isCurrentUserError,
		error: currentUserError,
	} = useGetCurrentUserQuery(undefined, { skip: !isCurrentUser });

	const {
		data: otherUser,
		isFetching: isUserFetching,
		isLoading: isUserLoading,
		isError: isUserError,
		error: userError,
	} = useGetUserQuery(profileId, { skip: isCurrentUser });
	const user = currentUser || otherUser;

	if (isUserLoading || isUserFetching || isCurrentUserFetching || isCurrentUserLoading) {
		return (
			<div>
				<h5>Rectangle</h5>
				<Skeleton className="mb-2"></Skeleton>
				<Skeleton width="10rem" className="mb-2"></Skeleton>
				<Skeleton width="5rem" className="mb-2"></Skeleton>
				<Skeleton height="2rem" className="mb-2"></Skeleton>
				<Skeleton width="10rem" height="4rem"></Skeleton>
			</div>
		);
	}

	if (!user) {
		return (
			<svg viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M799.056 615.996H473.713C467.896 615.996 463.162 611.262 463.162 605.445V131.552C463.162 125.734 467.896 121 473.713 121H799.056C804.874 121 809.608 125.732 809.608 131.552V605.443C809.608 611.262 804.874 615.996 799.056 615.996ZM473.713 121.45C468.142 121.45 463.612 125.982 463.612 131.552V605.443C463.612 611.014 468.144 615.545 473.713 615.545H799.056C804.627 615.545 809.158 611.012 809.158 605.443V131.552C809.158 125.982 804.625 121.45 799.056 121.45H473.713Z"
					fill="#F0F0F0"
				/>
				<path
					d="M423.886 615.996H98.5428C92.7252 615.996 87.9912 611.262 87.9912 605.445V131.552C87.9912 125.734 92.7234 121 98.5428 121H423.886C429.703 121 434.437 125.732 434.437 131.552V605.443C434.439 611.262 429.705 615.996 423.886 615.996ZM98.5428 121.45C92.9736 121.45 88.4412 125.982 88.4412 131.552V605.443C88.4412 611.014 92.9736 615.545 98.5428 615.545H423.886C429.457 615.545 433.987 611.012 433.987 605.443V131.552C433.987 125.982 429.455 121.45 423.886 121.45H98.5428Z"
					fill="#F0F0F0"
				/>
				<path d="M900 725.921H0V726.371H900V725.921Z" fill="#E0E0E0" />
				<path
					d="M324.774 166.724H381.602C383.092 166.724 384.302 165.514 384.302 164.024V151.195C384.302 149.705 383.092 148.495 381.602 148.495H324.774C323.282 148.495 322.074 149.705 322.074 151.195V164.024C322.074 165.514 323.282 166.724 324.774 166.724Z"
					fill="#F0F0F0"
				/>
				<path
					d="M290.831 189.971H347.659C349.15 189.971 350.359 188.761 350.359 187.271V174.442C350.359 172.952 349.15 171.742 347.659 171.742H290.831C289.341 171.742 288.131 172.952 288.131 174.442V187.271C288.131 188.763 289.341 189.971 290.831 189.971Z"
					fill="#F0F0F0"
				/>
				<path
					d="M173.122 440.144H116.294C114.804 440.144 113.594 438.934 113.594 437.444V424.615C113.594 423.125 114.804 421.915 116.294 421.915H173.122C174.613 421.915 175.822 423.125 175.822 424.615V437.444C175.822 438.936 174.613 440.144 173.122 440.144Z"
					fill="#F0F0F0"
				/>
				<path
					d="M207.065 463.392H150.237C148.747 463.392 147.537 462.183 147.537 460.692V447.864C147.537 446.373 148.747 445.164 150.237 445.164H207.065C208.555 445.164 209.765 446.373 209.765 447.864V460.692C209.765 462.185 208.555 463.392 207.065 463.392Z"
					fill="#F0F0F0"
				/>
				<path
					d="M720.792 458.529H663.964C662.474 458.529 661.264 457.319 661.264 455.829V443C661.264 441.508 662.474 440.3 663.964 440.3H720.792C722.282 440.3 723.492 441.508 723.492 443V455.829C723.492 457.319 722.284 458.529 720.792 458.529Z"
					fill="#F0F0F0"
				/>
				<path
					d="M788.677 458.529H731.849C730.359 458.529 729.149 457.319 729.149 455.829V443C729.149 441.508 730.359 440.3 731.849 440.3H788.677C790.169 440.3 791.377 441.508 791.377 443V455.829C791.377 457.319 790.169 458.529 788.677 458.529Z"
					fill="#F0F0F0"
				/>
				<path
					d="M754.735 481.778H697.907C696.416 481.778 695.207 480.568 695.207 479.078V466.249C695.207 464.759 696.416 463.549 697.907 463.549H754.735C756.225 463.549 757.435 464.759 757.435 466.249V479.078C757.435 480.568 756.227 481.778 754.735 481.778Z"
					fill="#F0F0F0"
				/>
				<path d="M822.289 571.185H757.366V725.921H822.289V571.185Z" fill="#E6E6E6" />
				<path d="M772.598 571.185H617.863V725.921H772.598V571.185Z" fill="#F5F5F5" />
				<path d="M706.93 571.185H687.812V725.471H706.93V571.185Z" fill="#FAFAFA" />
				<path d="M289.161 571.185H224.239V725.921H289.161V571.185Z" fill="#E6E6E6" />
				<path d="M239.47 571.185H84.735V725.921H239.47V571.185Z" fill="#F5F5F5" />
				<path d="M173.803 571.185H154.685V725.471H173.803V571.185Z" fill="#FAFAFA" />
				<path d="M617.863 653.49H552.94V725.921H617.863V653.49Z" fill="#E6E6E6" />
				<path d="M568.17 653.49H413.435V725.921H568.17V653.49Z" fill="#F5F5F5" />
				<path d="M502.502 653.49H483.385V725.71H502.502V653.49Z" fill="#FAFAFA" />
				<path d="M319.5 498.755H254.578V571.185H319.5V498.755Z" fill="#E6E6E6" />
				<path d="M269.809 498.755H115.074V571.185H269.809V498.755Z" fill="#F5F5F5" />
				<path d="M204.142 498.755H185.024V570.975H204.142V498.755Z" fill="#FAFAFA" />
				<path d="M639.29 155.684H497.052V297.922H639.29V155.684Z" fill="#E6E6E6" />
				<path d="M632.088 290.723V162.886L504.252 162.886V290.723H632.088Z" fill="#FAFAFA" />
				<path
					d="M559.602 261.692C559.602 261.692 583.076 213.565 632.088 212.6V290.724H568.17L559.602 261.692Z"
					fill="#F0F0F0"
				/>
				<path
					d="M504.252 248.179C504.252 248.179 525.361 237.113 546.815 245.236C573.755 255.437 589.378 290.724 589.378 290.724H504.252V248.179Z"
					fill="#F5F5F5"
				/>
				<path
					d="M548.107 225.965C560.563 225.965 570.661 215.867 570.661 203.411C570.661 190.955 560.563 180.857 548.107 180.857C535.651 180.857 525.553 190.955 525.553 203.411C525.553 215.867 535.651 225.965 548.107 225.965Z"
					fill="white"
				/>
				<path d="M234.545 155.684H109.757V397.269H234.545V155.684Z" fill="#E6E6E6" />
				<path d="M227.346 390.071L227.346 162.885L116.957 162.885L116.957 390.071H227.346Z" fill="#FAFAFA" />
				<path
					d="M155.18 255.836C167.636 255.836 177.734 245.738 177.734 233.282C177.734 220.826 167.636 210.728 155.18 210.728C142.724 210.728 132.626 220.826 132.626 233.282C132.626 245.738 142.724 255.836 155.18 255.836Z"
					fill="white"
				/>
				<path
					d="M137.594 390.069C137.594 390.069 165.532 255.735 227.345 243.674V390.069H172.152H137.594Z"
					fill="#F0F0F0"
				/>
				<path
					d="M116.957 310.346C116.957 310.346 131.179 296.633 153.709 304.83C196.049 320.235 219.681 390.069 219.681 390.069H116.957V310.346Z"
					fill="#F5F5F5"
				/>
				<path
					d="M730.926 261.14C751.58 258.584 766.252 239.769 763.696 219.114C761.141 198.459 742.325 183.788 721.67 186.343C701.016 188.899 686.344 207.715 688.9 228.369C691.456 249.024 710.271 263.696 730.926 261.14Z"
					fill="#E0E0E0"
				/>
				<path
					d="M760.145 231.657C764.514 212.99 752.923 194.315 734.256 189.946C715.589 185.577 696.914 197.168 692.545 215.835C688.176 234.502 699.767 253.177 718.434 257.546C737.101 261.915 755.776 250.324 760.145 231.657Z"
					fill="#FAFAFA"
				/>
				<path d="M726.415 192.188H725.116V199.428H726.415V192.188Z" fill="#E0E0E0" />
				<path d="M726.415 247.878H725.116V255.118H726.415V247.878Z" fill="#E0E0E0" />
				<path d="M701.539 223.002H694.3V224.302H701.539V223.002Z" fill="#E0E0E0" />
				<path d="M757.229 223.002H749.99V224.302H757.229V223.002Z" fill="#E0E0E0" />
				<path
					d="M747.565 200.978L742.445 206.097L743.364 207.016L748.484 201.897L747.565 200.978Z"
					fill="#E0E0E0"
				/>
				<path
					d="M708.157 240.303L703.04 245.424L703.959 246.343L709.076 241.222L708.157 240.303Z"
					fill="#E0E0E0"
				/>
				<path
					d="M703.988 200.984L703.069 201.903L708.189 207.021L709.108 206.102L703.988 200.984Z"
					fill="#E0E0E0"
				/>
				<path
					d="M743.366 240.365L742.447 241.284L747.565 246.403L748.485 245.485L743.366 240.365Z"
					fill="#E0E0E0"
				/>
				<path
					d="M725.556 222.78L725.147 223.817L737.423 228.651L737.831 227.614L725.556 222.78Z"
					fill="#E0E0E0"
				/>
				<path d="M726.322 224.21H706.075V223.096H725.207V207.38H726.322V224.21Z" fill="#E0E0E0" />
				<path
					d="M843.26 817.24C843.26 823.536 669.398 828.641 454.93 828.641C240.462 828.641 66.6 823.536 66.6 817.24C66.6 810.943 240.462 805.838 454.93 805.838C669.398 805.838 843.26 810.943 843.26 817.24Z"
					fill="#F5F5F5"
				/>
				<path d="M692.172 357.957L726.322 388.586H578.167L549.218 357.957H692.172Z" fill="#407BFF" />
				<path
					opacity="0.5"
					d="M692.172 357.957L726.322 388.586H578.167L549.218 357.957H692.172Z"
					fill="black"
				/>
				<path d="M692.239 357.957H549.218V500.978H692.239V357.957Z" fill="#407BFF" />
				<path opacity="0.2" d="M692.239 357.957H549.218V500.978H692.239V357.957Z" fill="black" />
				<path d="M646.295 357.957H503.275V500.978H646.295V357.957Z" fill="#407BFF" />
				<path d="M503.341 357.957L469.193 388.586H617.346L646.295 357.957H503.341Z" fill="#407BFF" />
				<path
					opacity="0.3"
					d="M503.341 357.957L469.193 388.586H617.346L646.295 357.957H503.341Z"
					fill="white"
				/>
				<path
					d="M577.116 407.234C590.449 407.234 599.503 415.095 599.503 428.028C599.503 442.055 589.554 448.226 576.221 448.226L575.825 456.086H565.974L565.477 440.464H568.76C580.005 440.464 588.661 438.475 588.661 428.028C588.661 421.064 584.383 416.785 577.219 416.785C570.155 416.785 565.679 420.763 565.679 427.729H555.034C554.927 415.692 563.585 407.234 577.116 407.234ZM570.748 478.075C566.667 478.075 563.485 474.891 563.485 470.814C563.485 466.733 566.669 463.551 570.748 463.551C574.727 463.551 577.912 466.735 577.912 470.814C577.913 474.891 574.729 478.075 570.748 478.075Z"
					fill="white"
				/>
				<path d="M652.495 500.98H483.901V515.798H652.495V500.98Z" fill="#407BFF" />
				<path opacity="0.3" d="M652.495 500.98H483.901V515.798H652.495V500.98Z" fill="black" />
				<path d="M715.115 500.98H652.495V515.798H715.115V500.98Z" fill="#407BFF" />
				<path opacity="0.5" d="M715.115 500.98H652.495V515.798H715.115V500.98Z" fill="black" />
				<path d="M595.487 515.796H585.326V794.6H595.487V515.796Z" fill="#263238" />
				<path opacity="0.2" d="M595.487 515.796H585.326V794.6H595.487V515.796Z" fill="white" />
				<path opacity="0.2" d="M595.487 522.735L585.326 526.936V515.796H595.487V522.735Z" fill="black" />
				<path
					d="M640.082 803.621H540.731V803.569C540.731 795.485 547.285 788.933 555.367 788.933H625.444C633.528 788.933 640.08 795.485 640.08 803.569V803.621H640.082Z"
					fill="#407BFF"
				/>
				<path
					d="M155.086 659.016C155.086 659.016 167.373 654.534 170.554 667.545C173.734 680.555 182.839 677.196 184.561 674.347C187.958 668.729 188.433 648.402 182.592 647.178C175.617 645.713 157.545 653.091 155.086 659.016Z"
					fill="#407BFF"
				/>
				<g opacity="0.4">
					<path
						d="M155.086 659.016C155.086 659.016 167.373 654.534 170.554 667.545C173.734 680.555 182.839 677.196 184.561 674.347C187.958 668.729 188.433 648.402 182.592 647.178C175.617 645.713 157.545 653.091 155.086 659.016Z"
						fill="black"
					/>
				</g>
				<path
					d="M182.594 647.178C168.183 647.387 164.371 660.041 162.056 671.195L157.372 662.453L160.693 677.969C160.337 679.664 159.964 681.23 159.536 682.591C156.067 693.58 145.368 696.928 145.368 696.928C145.368 696.928 144.722 692.466 144.153 686.198V686.193L149.396 677.945L143.698 680.339C143.06 670.508 142.974 658.685 145.368 651.946C149.996 638.936 162.41 642.939 162.41 642.939L182.594 647.178Z"
					fill="#407BFF"
				/>
				<path
					d="M218.484 633.516C218.484 633.516 210.931 631.241 203.017 642.044C195.39 652.454 192.35 653.676 187.18 649.628C182.011 645.579 185.137 622.901 190.976 621.675C197.953 620.212 216.027 627.588 218.484 633.516Z"
					fill="#407BFF"
				/>
				<g opacity="0.4">
					<path
						d="M218.484 633.516C218.484 633.516 210.931 631.241 203.017 642.044C195.39 652.454 192.35 653.676 187.18 649.628C182.011 645.579 185.137 622.901 190.976 621.675C197.953 620.212 216.027 627.588 218.484 633.516Z"
						fill="black"
					/>
				</g>
				<path
					d="M242.766 692.606C242.766 692.606 233.368 689.667 226.928 680.823L235.258 661.268L223.835 675.51C223.355 674.448 222.921 673.328 222.547 672.144C217.595 656.462 218.608 622.419 190.138 622.007L218.443 615.55C218.443 615.55 236.162 609.833 242.762 628.404C244.445 633.127 245.27 639.605 245.565 646.636L235.256 637.096C235.256 637.096 242.404 647.466 245.691 651.797C245.858 671.238 242.766 692.606 242.766 692.606Z"
					fill="#407BFF"
				/>
				<path
					d="M146.459 603.36C146.459 603.36 158.746 598.878 161.926 611.889C165.107 624.899 181.107 629.865 182.749 623.508C184.5 616.724 180.628 592.557 174.789 591.331C167.812 589.868 148.916 597.433 146.459 603.36Z"
					fill="#407BFF"
				/>
				<g opacity="0.4">
					<path
						d="M146.459 603.36C146.459 603.36 158.746 598.878 161.926 611.889C165.107 624.899 181.107 629.865 182.749 623.508C184.5 616.724 180.628 592.557 174.789 591.331C167.812 589.868 148.916 597.433 146.459 603.36Z"
						fill="black"
					/>
				</g>
				<path
					d="M175.304 591.437C152.028 591.776 148.126 614.855 144.769 631.838L132.908 614.729C133.06 615.224 139.349 635.636 141.781 643.729C136.298 658.023 122.173 662.451 122.173 662.451C122.173 662.451 118.219 635.134 119.489 614.166C122.958 611.295 129.091 606.152 129.091 606.152L120.001 608.402C120.46 604.556 121.163 601.085 122.173 598.245C128.774 579.68 146.498 585.395 146.498 585.395L175.304 591.437Z"
					fill="#407BFF"
				/>
				<path
					d="M184.563 705.107C184.532 705.107 184.504 705.105 184.471 705.102C184.027 705.051 183.704 704.65 183.755 704.205C191.815 632.477 171.621 571.997 171.416 571.396C171.27 570.971 171.499 570.51 171.922 570.366C172.35 570.226 172.809 570.451 172.951 570.874C173.158 571.481 193.466 632.304 185.368 704.387C185.321 704.801 184.97 705.107 184.563 705.107Z"
					fill="#407BFF"
				/>
				<path d="M215.867 699.885H153.571V708.608H215.867V699.885Z" fill="#263238" />
				<path opacity="0.2" d="M215.867 699.885H153.571V708.608H215.867V699.885Z" fill="white" />
				<path
					d="M205.819 708.608H163.305C158.198 720.467 141.692 755.412 141.692 765.737C141.692 777.95 156.924 803.405 156.924 803.405C156.924 805.232 212.198 805.232 212.198 803.405C212.198 803.405 227.43 777.95 227.43 765.737C227.43 755.412 210.924 720.467 205.819 708.608Z"
					fill="#263238"
				/>
				<path
					d="M272.444 222.057C293.366 222.057 310.327 205.097 310.327 184.175C310.327 163.253 293.366 146.292 272.444 146.292C251.522 146.292 234.562 163.253 234.562 184.175C234.562 205.097 251.522 222.057 272.444 222.057Z"
					fill="#407BFF"
				/>
				<g opacity="0.7">
					<path
						d="M272.444 222.057C293.366 222.057 310.327 205.097 310.327 184.175C310.327 163.253 293.366 146.292 272.444 146.292C251.522 146.292 234.562 163.253 234.562 184.175C234.562 205.097 251.522 222.057 272.444 222.057Z"
						fill="white"
					/>
				</g>
				<path
					d="M272.444 222.837C251.125 222.837 233.782 205.494 233.782 184.175C233.782 162.855 251.125 145.512 272.444 145.512C293.764 145.512 311.107 162.855 311.107 184.175C311.107 205.494 293.764 222.837 272.444 222.837ZM272.444 147.071C251.986 147.071 235.341 163.716 235.341 184.175C235.341 204.633 251.986 221.278 272.444 221.278C292.903 221.278 309.548 204.633 309.548 184.175C309.548 163.716 292.903 147.071 272.444 147.071Z"
					fill="#407BFF"
				/>
				<path
					d="M272.75 163.118C280.955 163.118 286.528 167.957 286.528 175.916C286.528 184.549 280.406 188.347 272.2 188.347L271.955 193.185H265.892L265.586 183.572H267.606C274.525 183.572 279.853 182.348 279.853 175.918C279.853 171.632 277.22 168.999 272.812 168.999C268.465 168.999 265.709 171.447 265.709 175.734H259.157C259.096 168.322 264.424 163.118 272.75 163.118ZM268.832 206.714C266.321 206.714 264.361 204.754 264.361 202.245C264.361 199.734 266.321 197.774 268.832 197.774C271.282 197.774 273.242 199.734 273.242 202.245C273.242 204.756 271.282 206.714 268.832 206.714Z"
					fill="#407BFF"
				/>
				<path
					d="M296.147 213.727L308.5 219.869C309.148 220.191 309.854 219.548 309.593 218.873L304.187 204.857C301.437 208.764 298.75 211.821 296.147 213.727Z"
					fill="#407BFF"
				/>
				<path
					d="M305.969 282.735C307.701 291.447 381.793 287.986 378.326 276.736C377.748 274.86 376.603 272.992 375.631 270.9C370.816 260.536 362.821 247.538 336.947 247.625C321.381 247.675 300.868 257.085 305.969 282.735Z"
					fill="#407BFF"
				/>
				<path d="M397.737 772.073L401.528 791.257H411.671L413.023 772.073H397.737Z" fill="#FFC3BD" />
				<path
					d="M410.333 788.823C410.333 788.823 412.256 786.447 414.697 787.257C417.136 788.069 420.329 792.063 420.329 792.063C420.329 792.063 433.559 796.306 437.132 796.529C440.705 796.752 443.831 798.763 445.171 805.684H401.848C401.848 805.684 400.144 790.053 399.879 787.373C399.614 784.692 403.857 788.042 403.857 788.042L410.333 788.823Z"
					fill="#407BFF"
				/>
				<path
					d="M443.884 803.621C441.279 803.596 438.685 803.571 436.081 803.544C424.701 803.429 413.321 803.301 401.944 803.186C401.51 803.186 401.51 802.509 401.944 802.521C402.71 802.534 403.488 802.534 404.255 802.547C404.255 802.521 404.267 802.482 404.28 802.457C405.914 798.842 404.024 795.152 400.756 793.3C400.372 793.095 400.718 792.508 401.087 792.726C404.624 794.731 406.566 798.677 404.944 802.547C406.553 802.572 408.15 802.584 409.759 802.597C421.126 802.712 432.504 802.84 443.884 802.955C444.317 802.957 444.317 803.634 443.884 803.621Z"
					fill="black"
				/>
				<path
					d="M418.793 794.785C420.3 792.668 422.845 792.067 424.984 793.664C425.329 793.921 425.664 793.34 425.322 793.086C422.869 791.253 419.922 792.049 418.216 794.448C417.965 794.798 418.545 795.134 418.793 794.785Z"
					fill="white"
				/>
				<path
					d="M422.527 795.912C424.033 793.795 426.578 793.194 428.717 794.79C429.062 795.048 429.397 794.466 429.055 794.213C426.602 792.38 423.655 793.176 421.949 795.575C421.697 795.924 422.278 796.259 422.527 795.912Z"
					fill="white"
				/>
				<path
					d="M426.38 797.039C427.887 794.922 430.432 794.321 432.569 795.917C432.914 796.175 433.249 795.593 432.907 795.339C430.454 793.507 427.507 794.303 425.801 796.702C425.552 797.051 426.132 797.386 426.38 797.039Z"
					fill="white"
				/>
				<path d="M306.994 772.209L309.098 791.257H319.241L322.279 772.209H306.994Z" fill="#FFC3BD" />
				<path
					d="M317.903 788.823C317.903 788.823 319.826 786.447 322.267 787.257C324.706 788.069 327.899 792.063 327.899 792.063C327.899 792.063 341.129 796.306 344.702 796.529C348.275 796.752 351.401 798.763 352.741 805.684H309.418C309.418 805.684 307.714 790.053 307.449 787.373C307.184 784.692 311.427 788.042 311.427 788.042L317.903 788.823Z"
					fill="#407BFF"
				/>
				<path
					d="M351.452 803.621C348.847 803.596 346.253 803.571 343.649 803.544C332.269 803.429 320.89 803.301 309.512 803.186C309.078 803.186 309.078 802.509 309.512 802.521C310.279 802.534 311.056 802.534 311.823 802.547C311.823 802.521 311.836 802.482 311.848 802.457C313.483 798.842 311.593 795.152 308.324 793.3C307.94 793.095 308.286 792.508 308.655 792.726C312.192 794.731 314.134 798.677 312.512 802.547C314.122 802.572 315.718 802.584 317.327 802.597C328.694 802.712 340.072 802.84 351.452 802.955C351.887 802.957 351.887 803.634 351.452 803.621Z"
					fill="black"
				/>
				<path
					d="M326.363 794.785C327.87 792.668 330.415 792.067 332.554 793.664C332.899 793.921 333.234 793.34 332.892 793.086C330.439 791.253 327.492 792.049 325.786 794.448C325.534 794.798 326.115 795.134 326.363 794.785Z"
					fill="white"
				/>
				<path
					d="M330.095 795.912C331.601 793.795 334.147 793.194 336.285 794.79C336.631 795.048 336.965 794.466 336.623 794.213C334.17 792.38 331.223 793.176 329.517 795.575C329.267 795.924 329.846 796.259 330.095 795.912Z"
					fill="white"
				/>
				<path
					d="M333.95 797.039C335.457 794.922 338.002 794.321 340.139 795.917C340.484 796.175 340.819 795.593 340.477 795.339C338.024 793.507 335.077 794.303 333.371 796.702C333.121 797.051 333.702 797.386 333.95 797.039Z"
					fill="white"
				/>
				<path
					d="M394.362 772.748H416.743C418.68 743.926 424.159 648.423 419.83 601.163C422.944 535.59 412.924 448.546 412.924 448.546H342.022C342.022 448.546 347.216 506.794 370.539 600.218C370.375 674.235 388.442 748.232 394.362 772.748Z"
					fill="#263238"
				/>
				<path
					opacity="0.2"
					d="M366.714 584.516C379.532 532.163 368.276 464.274 368.276 464.274L357.215 541.82L366.714 584.516Z"
					fill="black"
				/>
				<path
					d="M391.694 772.186L393.338 780.691L419.002 780.581L419.017 772.073L391.694 772.186Z"
					fill="#263238"
				/>
				<path
					d="M303.8 773.574H326.182C334.156 743.924 350.174 648.594 352.739 601.335C365.418 535.763 371.482 448.546 371.482 448.546H300.58C300.58 448.546 293.985 507.462 303.68 600.885C301.799 682.335 303.293 748.232 303.8 773.574Z"
					fill="#263238"
				/>
				<path
					d="M301.846 772.163L301.799 780.596L327.667 780.601L329.022 772.168L301.846 772.163Z"
					fill="#263238"
				/>
				<path
					d="M422.194 459.243C373.018 478.143 292.9 464.445 292.9 464.445C293.854 440.397 294.682 392.769 294.358 353.187C294.34 352.269 294.34 351.351 294.322 350.433C294.268 344.817 294.178 339.381 294.07 334.233C294.052 333.603 294.052 332.973 294.034 332.361C293.8 322.245 293.44 313.299 292.972 306.135C292.072 292.653 299.398 280.107 312.736 277.857C316.786 277.173 321.16 276.579 325.714 276.093C326.794 275.967 327.892 275.859 329.008 275.751C341.644 274.509 355.504 273.969 368.158 274.329C368.788 274.329 369.418 274.347 370.048 274.365C370.372 274.383 370.732 274.383 371.056 274.401C371.596 274.419 372.154 274.437 372.694 274.473C378.328 274.707 383.674 275.121 388.462 275.751C399.334 277.155 409 285.741 409.18 296.721C409.342 306.783 410.332 328.023 411.754 351.981C412.294 361.053 412.906 370.539 413.572 379.935C416.146 416.925 419.422 452.781 422.194 459.243Z"
					fill="#407BFF"
				/>
				<path
					d="M296.716 415.233C296.734 415.251 296.752 415.287 296.752 415.305L296.698 415.269C296.626 415.233 296.554 415.233 296.464 415.233L289.336 428.607C288.868 428.355 288.418 428.103 287.968 427.833L287.626 427.617L287.41 427.473L287.014 427.185L286.186 426.609L285.52 426.105C284.602 425.421 283.864 424.809 283.072 424.161C281.578 422.883 280.156 421.623 278.77 420.345C276.016 417.807 273.37 415.269 270.742 412.695C265.558 407.493 260.536 402.201 255.658 396.765C250.744 391.329 246.01 385.767 241.33 379.809C240.16 378.315 238.972 376.767 237.82 375.111C237.226 374.247 236.65 373.455 236.038 372.465C235.444 371.565 234.814 370.503 234.112 369.189L233.554 368.001L233.266 367.407C233.14 367.065 232.996 366.669 232.87 366.309L232.528 365.157C232.42 364.671 232.348 364.761 232.15 363.249C232.006 362.079 231.988 360.855 232.114 359.667L232.222 358.785C232.276 358.515 232.33 358.173 232.366 358.065L232.636 357.111C232.834 356.463 233.086 355.833 233.356 355.203L233.77 354.303L234.004 353.853L234.094 353.691L234.868 352.413C235.48 351.441 235.768 351.063 236.164 350.505C237.694 348.399 238.918 346.941 240.196 345.375C245.218 339.453 250.186 334.215 255.208 328.905C260.266 323.685 265.306 318.501 270.472 313.479C280.75 303.345 291.19 293.499 302.08 284.013L322.672 306.657C312.43 316.467 301.864 326.061 291.334 335.565L275.602 349.821C270.562 354.339 265.486 359.001 260.932 363.465C261.292 364.113 261.67 364.761 262.066 365.409C265.558 371.169 269.518 377.019 273.406 382.851C277.366 388.665 281.362 394.497 285.43 400.203C287.446 403.083 289.48 405.927 291.55 408.681C292.576 410.067 293.62 411.381 294.628 412.659L296.05 414.423L296.608 415.089L296.716 415.233Z"
					fill="#407BFF"
				/>
				<path
					d="M346.352 290.029C346.352 290.029 355.667 328.716 352.998 366.326"
					stroke="white"
					strokeWidth="0.5"
					strokeMiterlimit="10"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M367.544 289.192C367.544 289.192 376.859 327.879 374.189 365.489"
					stroke="white"
					strokeWidth="0.5"
					strokeMiterlimit="10"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					opacity="0.2"
					d="M413.572 379.935C395.392 353.427 381.69 323.981 372.942 291.285L411.754 351.981C412.294 361.053 412.906 370.539 413.572 379.935Z"
					fill="black"
				/>
				<path
					opacity="0.2"
					d="M319.001 403.443C319.001 403.443 322.497 427.058 321.246 440.655C321.246 440.655 360.029 446.732 400.828 437.705C402.455 428.535 402.363 414.699 398.657 401.057C374.654 399.843 347.708 400.95 319.001 403.443Z"
					fill="black"
				/>
				<path
					d="M377.577 199.116C369.891 196.386 361.35 196.73 354.116 200.497C349.393 202.958 345.287 206.725 345.388 212.377C345.623 225.564 349.301 247.623 349.301 247.623L393.815 227.499C393.815 227.499 397.057 216.452 391.842 209.407C387.972 204.178 383.258 201.134 377.577 199.116Z"
					fill="#263238"
				/>
				<path
					d="M345.582 226.188C345.582 226.188 346.549 222.356 342.128 215.237C337.707 208.118 342.553 203.688 345.953 204.714C345.953 204.714 344.18 200.33 347.125 198.828C350.071 197.327 351.569 199.041 351.569 199.041C351.569 199.041 362.666 190.161 377.735 193.137C389.876 195.534 398.855 187.069 403.36 190.367C407.866 193.664 399.672 196.744 399.672 196.744C399.672 196.744 406.96 200.758 405.826 204.502C404.694 208.246 398.021 208.543 398.021 208.543C398.021 208.543 404.95 213.144 402.124 216.206C399.298 219.269 390.483 215.558 390.483 215.558C390.483 215.558 355.527 215.376 345.582 226.188Z"
					fill="#263238"
				/>
				<path
					d="M368.753 264.019L368.755 264.037C368.723 264.093 368.708 264.131 368.676 264.186L365.875 271.482C365.546 272.997 365.36 274.522 365.317 276.018C365.276 277.28 365.342 278.518 365.477 279.713C366.883 282.156 367.11 287.376 361.238 286.764C353.828 286.004 341.264 274.378 341.131 271.059C345.656 261.308 349.956 249.113 350.451 239.382L357.912 249.441L368.753 264.019Z"
					fill="#FFC3BD"
				/>
				<g opacity="0.2">
					<path
						d="M368.674 264.186L365.873 271.482C361.469 268.865 357.113 263.778 356.539 258.725C356.148 255.082 358.114 251.927 359.568 251.9L368.674 264.186Z"
						fill="black"
					/>
				</g>
				<path
					d="M389.131 250.488C388.517 252.074 387.851 253.631 387.155 255.161C380.961 268.665 363.539 268.058 353.907 256.571C353.893 256.549 353.896 256.531 353.878 256.526C353.025 255.505 352.228 254.402 351.509 253.203C345.652 243.474 348.118 236.753 350.852 221.181C353.583 205.627 371.401 197.657 384.748 207.222C397.067 216.049 395.314 234.638 389.131 250.488Z"
					fill="#FFC3BD"
				/>
				<path
					d="M363.89 218.767C367.949 218.198 365.184 213.723 366.055 211.211C368.887 203.046 391.097 208.629 393.651 221.12C393.651 221.12 393.037 211.603 386.105 205.773C379.174 199.943 364.264 197.289 357.408 204.023C350.554 210.757 350.519 222.626 350.519 222.626C350.519 222.626 350.334 224.772 351.661 226.188C352.4 226.903 353.702 230.193 355.86 231.066C357.7 231.812 359.104 231.516 359.779 228.851C360.457 226.185 361.174 219.147 363.89 218.767Z"
					fill="#263238"
				/>
				<path
					d="M341.815 229.837C341.989 234.094 344.113 237.872 346.725 240.203C350.654 243.708 354.929 240.752 355.77 235.833C356.528 231.407 355.396 224.248 350.521 222.628C345.719 221.03 341.615 224.97 341.815 229.837Z"
					fill="#FFC3BD"
				/>
				<path
					opacity="0.2"
					d="M317.434 312.201L294.322 350.433C294.268 344.817 294.178 339.381 294.07 334.233C294.052 333.603 294.052 332.973 294.034 332.361L317.434 312.201Z"
					fill="black"
				/>
				<path
					d="M429.07 369.459C421.672 372.825 412.978 369.945 408.892 363.123C408.622 362.673 408.37 362.241 408.1 361.791C407.578 360.909 407.056 360.009 406.534 359.109C406.264 358.677 406.012 358.227 405.76 357.777C404.914 356.337 404.086 354.879 403.24 353.421C402.322 351.801 401.386 350.181 400.45 348.543C399.532 346.923 398.614 345.303 397.678 343.665C396.742 342.045 395.824 340.407 394.924 338.787C394.006 337.149 393.088 335.511 392.188 333.873C392.08 333.675 391.972 333.477 391.864 333.279C390.154 330.201 388.444 327.105 386.752 324.027C383.17 317.439 379.624 310.833 376.168 304.173C372.712 297.495 369.292 290.817 366.07 283.995L380.236 274.725C385.186 280.413 389.938 286.245 394.654 292.095C395.176 292.743 395.698 293.391 396.22 294.057L407.038 288.405C409.738 293.157 412.294 297.981 414.814 302.841C417.316 307.683 419.8 312.561 422.212 317.457C424.624 322.353 427.036 327.267 429.358 332.217C431.716 337.149 434.02 342.117 436.288 347.085L436.918 348.489C440.536 356.445 437.026 365.841 429.07 369.459Z"
					fill="#407BFF"
				/>
				<path
					d="M400.45 348.543C400.252 348.219 400.072 347.913 399.892 347.589C398.2 344.673 396.544 341.739 394.924 338.787C395.824 340.407 396.742 342.045 397.678 343.665C398.614 345.303 399.532 346.923 400.45 348.543Z"
					fill="#407BFF"
				/>
				<path
					d="M380.254 278.379C379.91 281.108 377.932 285.363 373.954 285.219C370.228 285.075 367.114 283.815 366.736 283.653C366.718 283.635 366.7 283.635 366.7 283.635C363.658 282.861 357.952 280.935 355.99 277.173C353.236 271.917 357.538 263.673 357.538 263.673C353.074 259.443 347.792 252.166 351.482 253.822C355.154 255.478 369.652 265.599 374.839 264.453C379.663 263.387 381.353 259.199 383.146 260.046C385.209 261.022 381.379 264.768 379.453 268.656C379.453 268.656 380.777 274.223 380.254 278.379Z"
					fill="#FFC3BD"
				/>
				<g opacity="0.2">
					<path
						d="M365.402 283.725C365.337 283.725 365.274 283.713 365.213 283.684C364.842 283.511 356.103 279.413 354.517 274.936C353.104 270.942 356.137 265.209 356.962 263.767C355.802 262.748 351.524 258.889 350.377 256.531C349.745 255.228 349.603 254.297 349.945 253.687C350.217 253.199 350.685 253.138 350.737 253.133C352.593 253.16 354.481 254.549 357.093 256.472C359.692 258.385 362.925 260.765 367.304 262.683C375.183 266.134 376.596 264.035 377.53 262.646L377.885 262.129C378.922 260.633 380.66 258.128 383.614 259.328C383.845 259.422 383.956 259.683 383.863 259.913C383.769 260.144 383.508 260.255 383.278 260.162C381.155 259.307 379.917 260.777 378.626 262.642L378.277 263.15C376.877 265.227 374.843 266.966 366.946 263.508C362.475 261.549 359.195 259.136 356.562 257.197C354.182 255.446 352.303 254.061 350.788 254.031C350.822 254.034 350.764 254.058 350.723 254.144C350.663 254.265 350.523 254.769 351.189 256.139C352.409 258.65 357.779 263.286 357.833 263.333C358 263.477 358.038 263.72 357.923 263.909C357.881 263.976 353.916 270.54 355.367 274.637C356.827 278.759 365.504 282.829 365.593 282.87C365.818 282.975 365.915 283.243 365.81 283.468C365.735 283.63 365.571 283.725 365.402 283.725Z"
						fill="black"
					/>
				</g>
				<path
					opacity="0.2"
					d="M386.631 281.985L425.182 340.636C425.182 340.636 420.682 320.985 386.631 281.985Z"
					fill="black"
				/>
				<path
					d="M294.095 415.53C294.095 415.53 309.611 420.308 310.837 423.333C312.064 426.359 306.994 425.576 306.994 425.576C306.994 425.576 312.527 426.741 312.377 428.872C312.197 431.43 306.889 430.589 306.889 430.589C306.889 430.589 311.369 431.702 311.092 433.584C310.804 435.537 304.753 434.963 304.753 434.963C304.753 434.963 307.764 436.27 306.731 437.454C305.698 438.639 294.421 437.813 290.853 435.276C287.285 432.74 289.586 418.524 290.633 415.431C291.681 412.339 289.845 409.131 294.226 405.589L294.095 415.53Z"
					fill="#FFC3BD"
				/>
				<path
					opacity="0.2"
					d="M306.958 425.812C306.95 425.81 306.943 425.81 306.934 425.807L297.382 423.373C297.254 423.339 297.176 423.209 297.209 423.081C297.241 422.954 297.378 422.874 297.5 422.909L307.053 425.344C307.181 425.376 307.258 425.508 307.226 425.636C307.195 425.756 307.078 425.832 306.958 425.812Z"
					fill="black"
				/>
				<path
					opacity="0.2"
					d="M306.576 430.782L306.571 430.78L297.212 429.081C297.083 429.057 296.996 428.933 297.02 428.802C297.043 428.67 297.146 428.604 297.299 428.609L306.657 430.308C306.787 430.332 306.873 430.458 306.85 430.587C306.824 430.717 306.704 430.802 306.576 430.782Z"
					fill="black"
				/>
				<path
					opacity="0.2"
					d="M304.394 435.149L297.407 434.061C297.275 434.042 297.187 433.917 297.207 433.788C297.227 433.656 297.349 433.566 297.481 433.588L304.468 434.675C304.6 434.695 304.688 434.819 304.668 434.949C304.648 435.08 304.526 435.17 304.394 435.149Z"
					fill="black"
				/>
			</svg>
		);
	}

	if (isUserError || isCurrentUserError) {
		console.log(userError || currentUserError);
		<div>
			{userError?.status} {JSON.stringify(userError?.data)}
			{currentUserError?.status} {JSON.stringify(currentUserError?.data)}
		</div>;
		// toast.error("échec de la requet des currentUser");
	}
	return (
		<>
			<div className="flex flex-column mb-6">
				<div className="cover-overlay h-18rem w-full">
					<img src="https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg" alt="Cover" />
				</div>
				<div className="flex align-items-start px-4 justify-content-between pt-3">
					<div className="z-4">
						<Avatar
							size="large"
							icon="pi pi-user"
							className="p-overlay border-0 border-circle"
							style={{
								minWidth: "48px",
								width: "35%",
								height: "auto",
								marginTop: "-23%",
								border: "1rem red solid",
							}}
							image={user?.picturePath}
							onClick={() => imgPrevRef.current.show()}
							alt={user?.fullName}
							shape="circle"
						/>
						<Image
							ref={imgPrevRef}
							src={user?.picturePath}
							alt="Avatar"
							preview
							style={{ visibility: "hidden", height: 0 }}
						/>
					</div>
					<Button
						label="Edit profile"
						className="z-4 p-button-text p-2 border-round-2xl border-primary"
						style={{ minWidth: "8rem" }}
					/>
				</div>
				<div className="flex flex-column gap-3">
					<h3 className="text-2xl font-bold"> {toTitleCase(user?.fullName)}</h3>
					<p className="text-sm">
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus repellat, aut laborum
						suscipit libero voluptas sed nihil, asperiores doloremque explicabo deserunt officia commodi
						temporibus animi debitis minima exercitationem nostrum delectus.
					</p>
					{/* profile status */}
					<div className="flex justify-content-between">
						<div className="flex flex-column gap-2 w-fit">
							<div>
								<i className="pi pi-map-marker " /> <span className="ml-1">{user?.location}</span>
							</div>
							<div>
								<i className="pi pi-briefcase" /> <span className="ml-1">{user?.job}</span>
							</div>
							<div className={`createData-tooltip-${user?.id} `}>
								<i className="pi pi-calendar" />{" "}
								<span className="ml-1">Joined : {format(new Date(user?.createdAt), "MMMM yyyy")}</span>
								<Tooltip
									key={user?.id}
									target={`.createData-tooltip-${user?.id}`}
									content={format(new Date(user?.createdAt), "EEEE, MMMM d, yyyy, h:mm a")}
									position="bottom"
								/>
							</div>
						</div>
						<div className="flex flex-column gap-2 w-fit">
							<div>
								<i className="pi pi-pencil" />{" "}
								<span className="ml-1">Total posts: {user?.totalPosts}</span>
							</div>
							<div>
								<i className="pi pi-eye" />{" "}
								<span className="ml-1">Profile views: {user?.totalProfileViews}</span>
							</div>
							<div>
								<i className="pi pi-chart-bar" />{" "}
								<span className="ml-1">Post impressions: {user?.totalPostImpressions}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-column gap-6">
				{isCurrentUser && <CreatePostWidget />}
				<UserPosts />
			</div>
		</>
	);
}
