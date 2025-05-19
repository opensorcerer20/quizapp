import { Button } from "react-native-paper";

const NavButton = ({ enabled, onClick, buttonText }) => {
    return (
        <Button
            style={{ marginTop: 10 }}
            buttonColor={enabled ? "#0000ff" : "#999999"}
            textColor="#e0e0e0"
            onPress={enabled ? () => onClick() : () => {}}
        >
            {buttonText}
        </Button>
    );
};

export const DeckNav = ({
    prevEnabled,
    onPrevClick,
    nextEnabled,
    onNextClick,
    onResetClick,
}) => {
    return (
        <>
            <NavButton
                enabled={prevEnabled}
                onClick={onPrevClick}
                buttonText="< Previous"
            />
            <NavButton
                enabled={nextEnabled}
                onClick={onNextClick}
                buttonText="Next >"
            />
            <Button
                style={{ marginTop: 10 }}
                buttonColor="#0000ff"
                textColor="#e0e0e0"
                onPress={onResetClick}
            >
                &lt;-- Start over
            </Button>
        </>
    );
};
