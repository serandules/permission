var has = function (tree, perms, action) {
    var allowed;
    if (!perms.length) {
        allowed = tree[''] || [];
        return allowed.indexOf('*') !== -1 || allowed.indexOf(action) !== -1;
    }
    var all = tree['*'];
    allowed = all ? all[''] || [] : [];
    if (allowed.indexOf('*') !== -1 || allowed.indexOf(action) !== -1) {
        return true;
    }
    tree = tree[perms.shift()];
    if (!tree) {
        return false;
    }
    return has(tree, perms, action);
};

var add = function (tree, perms, actions) {
    var allowed;
    var perm = perms.shift();

    if (perms.length) {
        tree = tree[perm] || (tree[perm] = {});
        return add(tree, perms, actions);
    }

    tree = tree[perm] || (tree[perm] = {});
    allowed = tree[''] || [];
    tree[''] = allowed.concat(actions);
};

/**
 * at least one permission tree has permitted
 * @param trees
 * @param perm
 * @param action
 * @returns {boolean}
 */
var least = function (trees, perm, action) {
    perm = perm.split(':');
    trees = trees instanceof Array ? trees : [trees];

    var i;
    var length = trees.length;
    for (i = 0; i < length; i++) {
        if (has(trees[i], perm, action)) {
            return true;
        }
    }
    return false;
};

module.exports.least = least;

/**
 * should all permission trees have permitted
 * @param trees
 * @param perm
 * @param action
 * @returns {boolean}
 */
var every = function (trees, perm, action) {
    perm = perm.split(':');
    trees = trees instanceof Array ? trees : [trees];

    var i;
    var length = trees.length;
    for (i = 0; i < length; i++) {
        if (!has(trees[i], perm, action)) {
            return false;
        }
    }
    return true;
};

module.exports.every = every;

/**
 * add an entry into the permission tree
 * @param tree
 * @param perm
 * @param actions
 */
var permit = function (tree, perm, actions) {
    actions = actions instanceof Array ? actions : [actions];
    return add(tree, perm.split(':'), actions);
};

module.exports.permit = permit;

/**
 * merge given permission trees
 * @returns {*}
 */
var merge = function () {
    var args = Array.prototype.slice.call(arguments);
    return args[0];
};

module.exports.merge = merge;
