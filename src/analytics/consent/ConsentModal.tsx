import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Switch,
    Typography,
} from '@mui/material';
import { useState } from 'react';

import { StandardModal } from '@/components/StandardModal';

import { TagManagerConsentType, useGTMConsent } from '../TagManager';

// based on https://blog.cloud66.com/google-tag-manager-consent-mode-v2-in-react and https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic#tag-manager

interface TagManagerConsentTypeDetails {
    name: string;
    summary: string;
    enabled: boolean;
}

// keys are taken from Tag Manager's docs: https://developers.google.com/tag-platform/tag-manager/templates/consent-apis#consent-introduction
const consentTypeDetails = {
    ad_storage: { name: 'Advertising Storage', summary: '', enabled: false },
    ad_user_data: { name: 'Send your data to third parties', summary: '', enabled: false },
    ad_personalization: { name: 'Personalized Advertising', summary: '', enabled: false },
    analytics_storage: {
        name: 'Analytics',
        summary:
            'Allows us to track your activities on the site, such as visit duration or button clicks.',
        enabled: true,
    },
    functionality_storage: { name: 'Site Functionality', summary: '', enabled: false },
    personalization_storage: { name: 'Personalized Content', summary: '', enabled: false },
    security_storage: { name: 'Security Features', summary: '', enabled: false },
} as const satisfies Record<TagManagerConsentType, TagManagerConsentTypeDetails>;

const defaultConsent: Record<TagManagerConsentType, boolean> = {
    ad_storage: false,
    ad_user_data: false,
    ad_personalization: false,
    analytics_storage: false,
    functionality_storage: false,
    personalization_storage: false,
    security_storage: false,
};

interface ConsentModalListItem {
    onClick: () => void;
    name: string;
    summary: string;
    isOptedInto: boolean;
}
const ConsentModalListItem = ({ onClick, name, summary, isOptedInto }: ConsentModalListItem) => {
    return (
        <ListItem>
            <ListItemButton onClick={onClick}>
                <ListItemText>
                    <Typography>{name}</Typography>
                    <Typography>{summary}</Typography>
                </ListItemText>
                <ListItemIcon>
                    <Switch
                        checked={isOptedInto}
                        onChange={(event) => {
                            // clicking is handled by the Button above this switch
                            event.preventDefault();
                        }}
                    />
                </ListItemIcon>
            </ListItemButton>
        </ListItem>
    );
};

interface ConsentModalProps {
    open?: boolean;
    onClose: () => void;
}

export const ConsentModal = ({ open, onClose }: ConsentModalProps): JSX.Element => {
    const { setGTMConsent } = useGTMConsent();
    const [consent, setConsent] = useState(defaultConsent);

    const toggleConsentSelection = (consentType: TagManagerConsentType) => {
        setConsent({ ...consent, [consentType]: !consent[consentType] });
    };

    const saveConsent = (newConsent?: typeof consent) => {
        onClose();
        setGTMConsent(newConsent ?? consent);
    };

    const handleDeclineConsent = () => {
        const allDeclinedConsent = (Object.keys(consent) as TagManagerConsentType[]).reduce(
            (acc, currentConsentType) => {
                acc[currentConsentType] = false;

                return acc;
            },
            // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
            {} as typeof consent
        );

        saveConsent(allDeclinedConsent);
    };

    const handleApproveAllConsent = () => {
        const allApprovedConsent = (Object.keys(consent) as TagManagerConsentType[]).reduce(
            (acc, currentConsentType) => {
                acc[currentConsentType] = true;

                return acc;
            },
            // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
            {} as typeof consent
        );

        saveConsent(allApprovedConsent);
    };

    return (
        <StandardModal open={open ?? false}>
            <DialogTitle padding={0} margin={0}>
                Privacy Customization
                <Typography>
                    This website uses external services and cookies to improve your experience while
                    you use the website. Your data will only be transferred to those external
                    services with your consent. Additionally, cookies or personal data will only be
                    saved to your browser with your consent.
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ paddingInline: 0 }}>
                {(
                    Object.entries(consentTypeDetails) as [
                        keyof typeof consentTypeDetails,
                        TagManagerConsentTypeDetails,
                    ][]
                )
                    .filter(([_consentType, consentTypeDetails]) => consentTypeDetails.enabled)
                    .map(([consentType, consentTypeDetails]) => (
                        <ConsentModalListItem
                            key={consentType}
                            onClick={() => {
                                toggleConsentSelection(consentType);
                            }}
                            name={consentTypeDetails.name}
                            summary={consentTypeDetails.summary}
                            isOptedInto={consent[consentType]}
                        />
                    ))}
            </DialogContent>
            <DialogActions sx={{ padding: 0 }}>
                <Button variant="outlined" onClick={handleDeclineConsent}>
                    Decline
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        saveConsent();
                    }}>
                    Approve Selection
                </Button>
                <Button variant="contained" onClick={handleApproveAllConsent}>
                    Approve all
                </Button>
            </DialogActions>
        </StandardModal>
    );
};
