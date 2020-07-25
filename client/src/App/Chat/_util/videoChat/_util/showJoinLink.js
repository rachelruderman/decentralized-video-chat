import Snackbar from 'node-snackbar';
import copy from 'copy-to-clipboard';

export function showJoinLink() {
    const { href } = window.location;

    Snackbar.show({
        text: `Here is the join link for your call: ${href}`,
        actionText: "Copy Link",
        width: "750px",
        pos: "top-center",
        actionTextColor: "#616161",
        duration: 500000,
        backgroundColor: "#16171a",
        onActionClick: () => {
            copy(href);
            Snackbar.close();
        },
    });
}