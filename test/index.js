var perm = require('../index');
var should = require('should');

var user = {
    vehicles: {
        '123456': {
            '': ['read', 'write'],
            'comments': {
                '': ['read'],
                '*': {
                    '': []
                },
                '0001': {
                    '': ['read', 'update'],
                    '*': ['read'],
                    'abcdef': {
                        '': ['update']
                    }
                }
            }
        },
        '*': {
            '': ['read']
        }
    }
};

var resource = {
    users: {
        '*': {
            '': ['read']
        },
        '123456': {
            '': ['read'],
            'comments': {
                '': ['read'],
                '0001': {
                    '': ['read', 'write']
                }
            }
        }
    }
};

/*
 resource.user ==> resource owner
 resource.has ==> contains who can access the resource
 users.has ==> contains which can be accessed by the user
 */

describe('permission:index should verify', function () {
    it('user tree parsing', function (done) {
        perm.least(user, 'vehicles:123456', 'read').should.equal(true);
        perm.least(user, 'vehicles:123456', 'write').should.equal(true);
        perm.least(user, 'vehicles:123456:comments', 'read').should.equal(true);
        perm.least(user, 'vehicles:123456:comments', 'write').should.equal(false);
        perm.least(user, 'vehicles:123456:comments:0001', 'read').should.equal(true);
        perm.least(user, 'vehicles:123456:comments:0001', 'update').should.equal(true);
        perm.least(user, 'vehicles:123456:comments:0001', 'write').should.equal(false);
        perm.least(user, 'vehicles:123456:comments:0001:abc', 'read').should.equal(true);
        perm.least(user, 'vehicles:123456:comments:0001:abc', 'write').should.equal(false);
        perm.least(user, 'vehicles:123456:comments:0001:abcdef', 'update').should.equal(true);
        perm.least(user, 'vehicles:123456:comments:0001:abc', 'write').should.equal(false);
        done();
    });

    it('resource tree parsing', function (done) {
        perm.least(resource, 'users:123456', 'read').should.equal(true);
        perm.least(resource, 'users:123456', 'write').should.equal(false);
        perm.least(resource, 'users:345678', 'read').should.equal(true);
        perm.least(resource, 'users:345678', 'write').should.equal(false);
        perm.least(resource, 'users:123456:comments', 'read').should.equal(true);
        perm.least(resource, 'users:123456:comments', 'write').should.equal(false);
        perm.least(resource, 'users:123456:comments:0001', 'read').should.equal(true);
        perm.least(resource, 'users:123456:comments:0001', 'write').should.equal(true);
        done();
    });

    it('permission true building', function (done) {
        var tree = {}
        perm.least(tree, 'users:123456', 'read').should.equal(false);
        perm.least(tree, 'users:123456:comments', 'read').should.equal(false);
        perm.permit(tree, 'users:123456', 'read');
        perm.least(tree, 'users:123456', 'read').should.equal(true);
        perm.least(tree, 'users:123456:comments', 'read').should.equal(false);
        perm.permit(tree, 'users:123456:*', 'read');
        perm.least(tree, 'users:123456', 'read').should.equal(true);
        perm.least(tree, 'users:123456:comments', 'read').should.equal(true);
        perm.least(tree, 'users:123456:comments:0001:user', 'read').should.equal(true);
        done();
    });
});