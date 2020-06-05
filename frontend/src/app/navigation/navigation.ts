import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'sample',
                title    : 'Sample',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/sample',
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            }
        ]
    },
    {
        id       : 'nav1',
        title    : 'Afternoon Tea',
        translate: 'NAV.PAGE.PAGE1',
        type     : 'group',
        children : [
            {
                id       : 'subNav1',
                title    : 'Current',
                translate: 'NAV.AFTERNOONTEA.PAGE1',
                type     : 'item',
                icon     : 'form',
                url      : 'afternoon-tea/forms',
            },
            {
                id       : 'subNav2',
                title    : 'History',
                translate: 'NAV.AFTERNOONTEA.PAGE2',
                type     : 'item',
                icon     : 'form',
                url      : 'afternoon-tea/history',
            },
            {
                id       : 'subNav2',
                title    : 'Coming Soon',
                translate: 'NAV.AFTERNOONTEA.PAGE3',
                type     : 'item',
                icon     : 'form',
                url      : 'coming-soon',
            }
        ]
    }
];
