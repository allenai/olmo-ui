export const datasetDocumentResponse = {
    added: null,
    archive: 'dclm-0281.json.zst',
    created: null,
    domain: null,
    id: '42103858',
    index: 'olmoe',
    isDocumentBad: true,
    metadata: {
        linenum: 261450,
        metadata: {
            id: 'http://www.losthighwaytimes.com/2008_01_01_archive.html',
            metadata: {
                'Content-Length': '391306',
                'Content-Type': 'application/http; msgtype=response',
                'WARC-Block-Digest': 'sha1:3P2AU4OIJBX2NCJV323JT5G2F5PJ4TC2',
                'WARC-Concurrent-To': '<urn:uuid:e2cfe11b-48a0-47d9-92a6-07037a8f363f>',
                'WARC-Date': '2017-06-23T08:31:42Z',
                'WARC-IP-Address': '216.58.217.147',
                'WARC-Identified-Payload-Type': 'application/xhtml+xml',
                'WARC-Payload-Digest': 'sha1:Q6ZLV5M5GD7BS5ELVWZPI2MX43ORDBRT',
                'WARC-Record-ID': '<urn:uuid:7a657abe-9385-4a51-8f87-3c2669bafa6b>',
                'WARC-Target-URI': 'http://www.losthighwaytimes.com/2008_01_01_archive.html',
                'WARC-Type': 'response',
                'WARC-Warcinfo-ID': '<urn:uuid:d22f600b-444e-40a9-a8a3-518095199684>',
                bff_contained_ngram_count_before_dedupe: 1704,
                fasttext_openhermes_reddit_eli5_vs_rw_v2_bigram_200k_train_prob: 0.4183654189109802,
                language_id_whole_page_fasttext: {
                    en: 0.9753509163856506,
                },
                previous_word_count: 14855,
                provenance: 'dclm_shard_00003987.jsonl.zstd:54191',
                url: 'http://www.losthighwaytimes.com/2008_01_01_archive.html',
                warcinfo:
                    'robots: classic\r\nhostname: ip-10-145-249-12.ec2.internal\r\nsoftware: Nutch 1.6 (CC)\r\nisPartOf: CC-MAIN-2017-26\r\noperator: Common Crawl Admin\r\ndescription: Wide crawl of the web for June 2017\r\npublisher: Common Crawl\r\nformat: WARC File Format 1.0\r\nconformsTo: http://bibnum.bnf.fr/WARC/WARC_ISO_28500_version1_latestdraft.pdf',
            },
            source: 'dclm-hero-run-fasttext_for_HF',
            version: '1.0',
        },
        path: 'dclm-0281.json.zst',
    },
    score: 0,
    snippets: [
        {
            spans: [
                {
                    highlight: false,
                    text: 'Test1',
                    words: 4921,
                },
                {
                    highlight: true,
                    text: 'Seattle',
                    words: 1,
                },
                {
                    highlight: false,
                    text: 'Test2',
                    words: 4297,
                },
                {
                    highlight: true,
                    text: 'Seattle',
                    words: 1,
                },
                {
                    highlight: false,
                    text: 'TestTestTest',
                    words: 488,
                },
                {
                    highlight: true,
                    text: 'Seattle',
                    words: 1,
                },
                {
                    highlight: false,
                    text: 'Okey okey okey okey',
                    words: 3511,
                },
            ],
        },
    ],
    source: 'dclm-hero-run-fasttext_for_HF',
    text: 'OkeyOkeyOkeyOkeyOkey',
    url: null,
    word_count: 19116,
};
