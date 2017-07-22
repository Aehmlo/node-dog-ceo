const request = require('request')

class Breed {

	static doApiRequest(endpoint, callback, root) {
		return request({
			uri: (root ? `${root}/${endpoint}` : `https://dog.ceo/api/breed/${endpoint}`),
			json: true
		}, (err, res, body) => {
			if(err) return callback(err)
			if(body.status === 'error') {
				let err = new Error(body.message)
				err.name = body.code
				return callback(err)
			}
			return callback(null, body.message)
		})
	}

	static list(callback) {
		return Breed.doApiRequest('list', callback)
	}

	static getRandomImageUrl(callback) {
		return Breed.doApiRequest('image/random', callback, 'https://dog.ceo/api/breeds')
	}

	constructor(breed, subbreed) {
		this.identifier = subbreed ? [breed, subbreed].join('/') : breed
	}

	_populateImageUrlCache(callback) {
		return Breed.doApiRequest(`${this.identifier}/images`, (err, images) => {
			if(!images) images = []
			this._imageUrls = images
			return callback(null, images)
		})
	}

	getImageUrls(callback) {
		if(!this._imageUrls) return this._populateImageUrlCache(callback)
		return callback(null, this._imageUrls)
	}

	getRandomImageUrl(callback) {
		return Breed.doApiRequest(`${this.identifier}/images/random`, callback)
	}

}

module.exports = Breed