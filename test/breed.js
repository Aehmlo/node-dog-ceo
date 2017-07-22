const chai = require('chai')
const should = chai.should()
const nock = require('nock')

const Breed = require('..').Breed

let domain = /dog\.ceo/

describe('Breed', () => {

	it('should exist', () => { // A good starting point
		should.exist(Breed)
	})

	it('should be a class', () => {
		(() => {
			let breed = new Breed('foo')
		}).should.not.throw()
	})

	describe('#doApiRequest', () => {
		it('should encode API errors as JavaScript errors', (done) => {
			let scope = nock(domain).get('/api/breed/foo/images/random').reply(200, { status: 'error', message: '', code: 403 })
			let breed = new Breed('foo')
			breed.getRandomImageUrl((err) => {
				should.exist(err)
				err.should.be.an('error')
				done()
			})
		})
	})

	describe('#list', () => {
		it('should return an array of dog breeds', (done) => {
			let scope = nock(domain).get('/api/breed/list').reply(200, { message: [] })
			Breed.list((err, list) => {
				list.should.be.an('array')
				done()
			})
		})
	})

	describe('#getRandomImageUrl', () => {
		it('should return a single random image URL from all the possible URLs', (done) => {
			let scope = nock(domain).get('/api/breeds/image/random').reply(200, { message: '' })
			Breed.getRandomImageUrl((err, url) => {
				url.should.be.a('string')
				done()
			})
		})
	})

	describe('.constructor', () => {
		it('should assign the breed\'s identifier according to the passed argument, if only one is passed', () => {
			const b = 'beagle'
			let breed = new Breed(b)
			breed.identifier.should.equal(b)
		})
		it('should assign a sub-breed as well if given one (i.e. two arguments)', () => {
			const b = 'foo', s = 'bar'
			let breed = new Breed(b, s)
			breed.identifier.should.equal([b, s].join('/'))
		})
	})

	describe('._populateImageUrlCache', () => {
		it('should create at least something when called', (done) => {
			let scope = nock(domain).get('/api/breed/foo/images').reply(200, { message: [] })
			let breed = new Breed('foo')
			should.not.exist(breed._imageUrls)
			breed._populateImageUrlCache(() => {
				should.exist(breed._imageUrls)
				done()
			})
		})
	})

	describe('.getImageUrls', () => {
		it('should return an array of image URLs (or an empty array)', (done) => {
			let scope = nock(domain).get('/api/breed/beagle/images').reply(200, { message: [] })
			let breed = new Breed('beagle')
			breed.getImageUrls((err, urls) => {
				urls.should.be.an('array')
				done()
			})
		})
	})

	describe('.getRandomImageUrl', () => {
		it('should return a single random image URL', (done) => {
			let scope = nock(domain).get('/api/breed/beagle/images/random').reply(200, { message: '' })
			let breed = new Breed('beagle')
			breed.getRandomImageUrl((err, url) => {
				url.should.be.a('string')
				done()
			})
		})
	})

})