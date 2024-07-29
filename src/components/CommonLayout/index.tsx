import { SlideLayoutWrapper, TopLayoutComponent } from "components";
import { NewBottomLayout } from "@styled";
interface Props {
  children: JSX.Element[] | JSX.Element;
  onTopImageClick: () => void;
  title: string;
  // topLayoutStyle?: React.CSSProperties;
  bottomLayoutStyle?: React.CSSProperties;
}

const CommonLayout = ({
  children,
  onTopImageClick,
  title,
  bottomLayoutStyle,
}: Props) => {
  return (
    <div className="c-c-fs full-height">
      <TopLayoutComponent text={title} onTopImageClick={onTopImageClick} />
      <SlideLayoutWrapper>
        <NewBottomLayout style={bottomLayoutStyle}>{children}</NewBottomLayout>
      </SlideLayoutWrapper>
    </div>
  );
};

export default CommonLayout;
