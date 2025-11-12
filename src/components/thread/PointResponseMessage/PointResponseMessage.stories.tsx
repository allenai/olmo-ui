import type { Meta, StoryObj } from '@storybook/react-vite';

import { threadOptions } from '@/api/playgroundApi/thread';
import { withMockQueryContext } from '@/utils/storybook/withMockQueryContext';
import { withMockThreadView } from '@/utils/storybook/withMockThreadView';
import { withMockReactQuery } from '@/utils/storybook/withReactQuery';
import { createMockMessage, createMockThread } from '@/utils/test/createMockModel';

import { PointResponseMessage } from './PointResponseMessage';

// This is just test data. points may not be accurate.
const mockThread = createMockThread({
    id: 'thread',
    messages: [
        createMockMessage({
            id: 'user-message-1',
            role: 'user',
            content: 'count the boats',
            fileUrls: [
                'https://storage.googleapis.com/ai2-playground-molmo/msg_S8V2L5A8K8/msg_S8V2L5A8K8-0.png',
            ],
        }),
        createMockMessage({
            id: 'assistant-message-molmo2-points',
            role: 'assistant',
            content:
                'Counting the <points coords="1 1 073 160 2 173 600 3 258 725 4 323 735 5 353 160 6 373 460 7 433 155 8 443 455 9 503 695 10 513 445 11 523 635 12 563 135 13 583 425 14 593 795 15 623 635 16 673 635 17 723 755 18 733 625 19 773 415 20 813 615 21 833 405 22 903 605 23 913 395" alt="boats">the boats</points> shows a total of 23.',
        }),
        createMockMessage({
            id: 'assistant-message-molmo1-points',
            role: 'assistant',
            content:
                'Counting the <points x1="9.1" y1="11.7" x2="17.2" y2="41.3" x3="19.6" y3="3.4" x4="26.8" y4="54.4" x5="30.8" y5="1.6" x6="34.1" y6="75.6" x7="36.0" y7="9.9" x8="37.5" y8="28.3" x9="40.9" y9="0.6" x10="43.4" y10="12.4" x11="45.9" y11="27.8" x12="47.8" y12="1.4" x13="51.9" y13="41.6" x14="53.7" y14="26.6" x15="54.6" y15="63.2" x16="56.9" y16="8.2" x17="59.2" y17="40.0" x18="60.3" y18="85.9" x19="63.1" y19="27.3" x20="64.7" y20="5.8" x21="65.3" y21="61.4" x22="68.8" y22="38.7" x23="70.8" y23="5.6" x24="75.0" y24="60.5" x25="79.5" y25="35.4" x26="80.2" y26="82.2" x27="80.3" y27="21.2" x28="84.5" y28="57.7" x29="85.3" y29="22.2" x30="86.2" y30="6.2" x31="91.6" y31="3.4" x32="93.8" y32="55.7" x33="94.1" y33="33.1" x34="96.8" y34="21.7" x35="98.4" y35="2.6" x36="99.3" y36="54.4" x37="99.5" y37="20.9" alt="the boats">the boats</points> shows a total of 37.',
        }),
        createMockMessage({
            id: 'assistant-message-molmo1-sets-of-points',
            role: 'assistant',
            content:
                ' The image shows a marina with various types of boats. <point x="63.3" y="85.8" alt="Small fishing boat">Small fishing boats</point> are visible, along with <point x="76.8" y="61.8" alt="Sailboat with blue sail">sailboats</point> that have their sails down. There are also <point x="78.2" y="36.0" alt="Motorboat">motorboats</point> docked in the slips. The boats appear to be primarily <point x="53.3" y="27.6" alt="White boat">white</point> in color, with some featuring <point x="77.8" y="76.0" alt="Boat with blue canopy">blue canopies or sails</point>. This variety of watercraft represents a typical scene at a busy marina.',
        }),
    ],
});

const meta = {
    component: PointResponseMessage,
    decorators: [withMockReactQuery, withMockQueryContext, withMockThreadView],
    parameters: {
        mockData: [{ queryKey: threadOptions(mockThread.id).queryKey, data: mockThread }],
    },
} satisfies Meta<typeof PointResponseMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        messageId: 'assistant-message-molmo2-points',
    },
};

export const Molmo1ImagePoints: Story = {
    args: {
        messageId: 'assistant-message-molmo1-points',
    },
};

export const Molmo1MultiImagePoints: Story = {
    args: {
        messageId: 'assistant-message-molmo1-sets-of-points',
    },
};
