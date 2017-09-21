import ItemUUID from "../src/ItemUUID";
import User from "../src/User";

const expect = require('chai').expect;

import {defaultQuery} from './mocks/queries';
import {FILTER_AT_LEAST_ONE} from "../src/Filter";
import Query, {
    QUERY_DEFAULT_PAGE,
    QUERY_DEFAULT_SIZE
} from '../src/Query';

/**
 * Query object tests
 */
describe('# Test: new Query()', () => {
    describe('-> filterBy...() methods', () => {
        let query = new Query({
            q: '',
            QUERY_DEFAULT_PAGE,
            QUERY_DEFAULT_SIZE
        });

        it('should filterBy()', () => {
            query.filterBy('source', 'source', ['source_id_123456']);
            expect(query.filters).to.have.own.property('source');
            expect(query.filters.source).to.include.all.keys(
                'application_type',
                'field',
                'filter_terms',
                'filter_type',
                'values'
            );
            expect(query.filters.source.values).to.include('source_id_123456');
        });
        it('should filterByTypes()', () => {
            query.filterByTypes(['item_uuid_type']);
            expect(query.filters).to.have.own.property('type');
            expect(query.filters.type).to.deep.equal({
                application_type: 8,
                field: 'uuid.type',
                filter_terms: [],
                filter_type: 'field',
                values: ['item_uuid_type']
            });
        });
        it('should filterByIds()', () => {
            query.filterByIds(['item_uuid_id']);
            expect(query.filters).to.have.own.property('id');
            expect(query.filters.id).to.deep.equal({
                application_type: 8,
                field: 'uuid.id',
                filter_terms: [],
                filter_type: 'field',
                values: ['item_uuid_id']
            });
        });
    });

    describe('-> filterUniverseBy...() methods', () => {
        let query = new Query({
            q: '',
            QUERY_DEFAULT_PAGE,
            QUERY_DEFAULT_SIZE
        });

        it('should filterUniverseBy()', () => {
            query.filterUniverseBy('source', ['source_id_123456']);
            expect(query.universe_filters).to.have.own.property('source');
            expect(query.universe_filters.source).to.include.all.keys(
                'application_type',
                'field',
                'filter_terms',
                'filter_type',
                'values'
            );
            expect(query.universe_filters.source.values).to.include('source_id_123456');
        });
        it('should filterUniverseByTypes()', () => {
            query.filterUniverseByTypes(['item_uuid_type']);
            expect(query.universe_filters).to.have.own.property('type');
            expect(query.universe_filters.type).to.deep.equal({
                application_type: 8,
                field: 'uuid.type',
                filter_terms: [],
                filter_type: 'field',
                values: ['item_uuid_type']
            });
        });
        it('should filterUniverseByIds()', () => {
            query.filterUniverseByIds(['item_uuid_id']);
            expect(query.universe_filters).to.have.own.property('id');
            expect(query.universe_filters.id).to.deep.equal({
                application_type: 8,
                field: 'uuid.id',
                filter_terms: [],
                filter_type: 'field',
                values: ['item_uuid_id']
            });
        });
    });

    describe('-> aggregateBy...() methods', () => {
        let query = new Query({
            q: '',
            QUERY_DEFAULT_PAGE,
            QUERY_DEFAULT_SIZE
        });

        it('should aggregateBy()', () => {
            query.aggregateBy('source', 'source');
            expect(query.aggregations).to.have.own.property('source');
            expect(query.aggregations.source).to.include.all.keys(
                'applicationType',
                'field',
                'filterType',
                'limit',
                'name',
                'sort',
                'subgroup'
            );
            expect(query.aggregations.source.name).to.include('source');
        });
    });

    describe('-> sortBy...() method', () => {
        let query = new Query({
            q: '',
            QUERY_DEFAULT_PAGE,
            QUERY_DEFAULT_SIZE
        });
        it('should throw an error when sortBy() without parameters', () => {
            expect(() => query.sortBy()).to.throw(Error);
        });
        it('should sortBy()', () => {
            query.sortBy({
                'random': {
                    'order': 'asc'
                }
            })
            expect(query.sort).to.deep.equal({
                'random': {
                    'order': 'asc'
                }
            });
        });
        it('should overwrite the last sort object setting again sortBy()', () => {
            query.sortBy({
                'uuid.type': {
                    'order': 'asc'
                }
            })
            expect(query.sort).to.deep.equal({
                'uuid.type': {
                   'order': 'asc'
                }
            });
        });
        it('should throw an error when sortBy() "_geo_distance" without a location object', () => {
            expect(() => query.sortBy({
                '_geo_distance': {
                    'order': 'asc',
                    'unit': 'km'
                }
            })).to.throw(Error);
        });
        it('should sortBy() "_geo_distance" when Query has been created with createLocated() method', () => {
            let query = new Query({
                q: '',
                QUERY_DEFAULT_PAGE,
                QUERY_DEFAULT_SIZE,
                coordinate:  {
                    lat: 1.234,
                    lon: 1.234
                }
            });
            query.sortBy({
                '_geo_distance': {
                    'order': 'asc',
                    'unit': 'km'
                }
            });
            expect(query.sort).to.deep.equal({
                '_geo_distance': {
                    'coordinate': {
                        'lat': 1.234,
                        'lon': 1.234
                    },
                    'order': 'asc',
                    'unit': 'km'
                }
            });
        });
    });

    describe('-> When promoting uuids', () => {
        let query = new Query({
            q: '',
            QUERY_DEFAULT_PAGE,
            QUERY_DEFAULT_SIZE
        });

        it('should promote one uuid when calling promoteUUID()', () => {
            query.promoteUUID(
                new ItemUUID('spiderman', 'marvel')
            );
            expect(query.items_promoted).to.deep.equal([
                {
                    id: 'spiderman',
                    type: 'marvel'
                }
            ]);
        });
        it('should promote many uuids when calling promoteUUIDs()', () => {
            // Promote thi two uuids into an existing array from the last test
            query.promoteUUIDs([
                new ItemUUID('ironman', 'marvel'),
                new ItemUUID('thor', 'marvel')
            ]);
            expect(query.items_promoted).to.deep.equal([
                {
                    id: 'spiderman',
                    type: 'marvel'
                },
                {
                    id: 'ironman',
                    type: 'marvel'
                },
                {
                    id: 'thor',
                    type: 'marvel'
                }
            ]);
        });
    });

    describe('-> When excluding uuids', () => {
        let query = new Query({
            q: '',
            QUERY_DEFAULT_PAGE,
            QUERY_DEFAULT_SIZE
        });
        query.excludeUUID(
            new ItemUUID('hulk', 'marvel')
        );

        it('should exist "excluded_ids" property on Query object', () => {
            expect(query.filters).to.have.own.property('excluded_ids');
        });
        it('should "excluded_ids" property be an object type of Filter', () => {
            expect(query.filters['excluded_ids'].constructor.name).to.be.equal('Filter');
        });
        it('should exclude one uuid when calling excludeUUID()', () => {
            expect(query.filters['excluded_ids'].values).to.include('marvel~hulk');
        });
        it('should exclude many uuids when calling excludeUUIDs()', () => {
            query.excludeUUIDs([
                new ItemUUID('captain-america', 'marvel'),
                new ItemUUID('daredevil', 'marvel')
            ]);
            expect(query.filters['excluded_ids'].values).to.deep.equal([
                'marvel~captain-america',
                'marvel~daredevil'
            ]);
        });
    });

    describe('-> When switching query setters', () => {
        let query = new Query({
            q: '',
            QUERY_DEFAULT_PAGE,
            QUERY_DEFAULT_SIZE
        });

        it('should set and unset aggregations properly', () => {
            query.disableAggregations();
            expect(query.aggregations_enabled).to.be.false;
            query.enableAggregations();
            expect(query.aggregations_enabled).to.be.true;
        });

        it('should set and unset suggestions properly', () => {
            query.enableSuggestions();
            expect(query.suggestions_enabled).to.be.true;
            query.disableSuggestions();
            expect(query.suggestions_enabled).to.be.false;
        });

        it('should set and unset highlights properly', () => {
            query.enableHighlights();
            expect(query.highlight_enabled).to.be.true;
            query.disableHighlights();
            expect(query.highlight_enabled).to.be.false;
        });
    })

    describe('-> When setting/unsetting a User on query', () => {
        let query = new Query({
            q: '',
            QUERY_DEFAULT_PAGE,
            QUERY_DEFAULT_SIZE
        });

        it('should set a user when calling byUser() method', () => {
            query.byUser(
                new User('some_user_uuid')
            );
            expect(query.user).to.deep.equal({
                id:'some_user_uuid'
            });
        });
        it('should unset the user when calling anonymously() on a user query', () => {
            query.anonymously();
            expect(query.user).to.be.equal(null);
        });
    })
});

