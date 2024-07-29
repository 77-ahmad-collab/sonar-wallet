import { AmountPercentageBtns as BTNN } from "@styled";

const AmountPercentageBtns = ({
  currentRatio = 0,
  ButtonsInfo,
}: {
  currentRatio: number;
  ButtonsInfo: {
    text: string;
    onClick: () => void;
    ratio: number;
    disabled: boolean;
  }[];
}) => {
  return (
    <div className="r-c-c mgl-sm">
      {ButtonsInfo.map((info, key) => (
        <BTNN
          id={`${info.text}`}
          key={key}
          toggled={currentRatio === info.ratio}
          onDarkBack
          className="f-label-sm"
          onClick={() => {
            if (info.ratio !== currentRatio) info.onClick();
          }}
          disabled={info.disabled}
        >
          {info.text}
        </BTNN>
      ))}
    </div>
  );
};

export default AmountPercentageBtns;
