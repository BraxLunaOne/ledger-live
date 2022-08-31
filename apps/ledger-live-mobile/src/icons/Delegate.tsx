import React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@react-navigation/native";

export default ({ size = 24, color }: { size?: number; color?: string }) => {
  const { colors } = useTheme();
  return (
    <Svg viewBox="0 0 16 16" width={size} height={size}>
      <Path
        fill={color || colors.darkBlue}
        d="M8.984 14c.54 0 1.048-.212 1.449-.687.656.249 1.43.074 1.9-.481l.777-.925c.167-.198.27-.424.324-.66h2.091A.468.468 0 0016 10.79v-.459a.468.468 0 00-.475-.458h-2.43a1.634 1.634 0 00-.228-.22L9.818 7.264l.371-.326a.446.446 0 00.03-.647l-.324-.338a.49.49 0 00-.67-.029l-1.64 1.45c-.281.248-.762.268-1.027 0a.666.666 0 01.033-.975L8.54 4.68c.22-.196.504-.302.801-.302l2.485-.005c.062 0 .122.023.163.066l1.832 1.764h1.705A.468.468 0 0016 5.744v-.459a.468.468 0 00-.475-.458h-1.111L13 3.464A1.712 1.712 0 0011.825 3H5.092c-.44 0-.864.169-1.176.467L2.503 4.83H.475A.468.468 0 000 5.288v.458c0 .252.214.459.475.459h2.619L4.926 4.44l.169-.066h1.683L5.63 5.39a2 2 0 00-.13 2.901c.439.464 1.816 1.18 3.013.126l.243-.214 3.212 2.514c.101.08.12.223.036.324l-.775.922a.246.246 0 01-.335.034l-.71-.555-.89 1.045a.402.402 0 01-.265.137.389.389 0 01-.27-.068l-1.092-.902-.463.55c-.413.49-1.164.564-1.642.188l-2.889-2.52H.475a.468.468 0 00-.475.458v.459c0 .252.214.458.475.458h1.642l2.512 2.188c.917.719 2.19.736 3.135.109.37.309.772.455 1.22.455z"
      />
    </Svg>
  );
};
