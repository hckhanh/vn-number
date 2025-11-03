import { describe, expect, it } from 'vitest'
import { readVnNumber } from './index.ts'

describe('readVnNumber', () => {
  describe('zero and single digits', () => {
    it('should read 0', () => {
      expect(readVnNumber(0)).to.equal('không')
      expect(readVnNumber('0')).to.equal('không')
    })

    it('should read single digits 1-9', () => {
      expect(readVnNumber(1)).to.equal('một')
      expect(readVnNumber(2)).to.equal('hai')
      expect(readVnNumber(3)).to.equal('ba')
      expect(readVnNumber(4)).to.equal('bốn')
      expect(readVnNumber(5)).to.equal('năm')
      expect(readVnNumber(6)).to.equal('sáu')
      expect(readVnNumber(7)).to.equal('bảy')
      expect(readVnNumber(8)).to.equal('tám')
      expect(readVnNumber(9)).to.equal('chín')
    })
  })

  describe('two-digit numbers (10-99)', () => {
    it('should read 10-19 with "mười"', () => {
      expect(readVnNumber(10)).to.equal('mười')
      expect(readVnNumber(11)).to.equal('mười một')
      expect(readVnNumber(15)).to.equal('mười lăm')
      expect(readVnNumber(19)).to.equal('mười chín')
    })

    it('should read 20-99 with "mươi"', () => {
      expect(readVnNumber(20)).to.equal('hai mươi')
      expect(readVnNumber(30)).to.equal('ba mươi')
      expect(readVnNumber(50)).to.equal('năm mươi')
      expect(readVnNumber(90)).to.equal('chín mươi')
      expect(readVnNumber(99)).to.equal('chín mươi chín')
    })

    it('should use "mốt" for 21, 31, etc.', () => {
      expect(readVnNumber(21)).to.equal('hai mươi mốt')
      expect(readVnNumber(31)).to.equal('ba mươi mốt')
      expect(readVnNumber(51)).to.equal('năm mươi mốt')
      expect(readVnNumber(91)).to.equal('chín mươi mốt')
    })

    it('should use "lăm" for 25, 35, etc.', () => {
      expect(readVnNumber(25)).to.equal('hai mươi lăm')
      expect(readVnNumber(35)).to.equal('ba mươi lăm')
      expect(readVnNumber(45)).to.equal('bốn mươi lăm')
      expect(readVnNumber(95)).to.equal('chín mươi lăm')
    })

    it('should NOT use "lăm" for 15 in 10-19 range', () => {
      expect(readVnNumber(15)).to.equal('mười lăm')
    })
  })

  describe('three-digit numbers (100-999)', () => {
    it('should read hundreds with "trăm"', () => {
      expect(readVnNumber(100)).to.equal('một trăm')
      expect(readVnNumber(200)).to.equal('hai trăm')
      expect(readVnNumber(500)).to.equal('năm trăm')
      expect(readVnNumber(900)).to.equal('chín trăm')
    })

    it('should use "lẻ" for numbers like 101, 102, 305', () => {
      expect(readVnNumber(101)).to.equal('một trăm lẻ một')
      expect(readVnNumber(102)).to.equal('một trăm lẻ hai')
      expect(readVnNumber(105)).to.equal('một trăm lẻ năm')
      expect(readVnNumber(305)).to.equal('ba trăm lẻ năm')
      expect(readVnNumber(909)).to.equal('chín trăm lẻ chín')
    })

    it('should read three-digit numbers correctly', () => {
      expect(readVnNumber(123)).to.equal('một trăm hai mươi ba')
      expect(readVnNumber(456)).to.equal('bốn trăm năm mươi sáu')
      expect(readVnNumber(789)).to.equal('bảy trăm tám mươi chín')
    })

    it('should handle "mốt" in three-digit numbers', () => {
      expect(readVnNumber(121)).to.equal('một trăm hai mươi mốt')
      expect(readVnNumber(331)).to.equal('ba trăm ba mươi mốt')
      expect(readVnNumber(991)).to.equal('chín trăm chín mươi mốt')
    })

    it('should handle "lăm" in three-digit numbers', () => {
      expect(readVnNumber(125)).to.equal('một trăm hai mươi lăm')
      expect(readVnNumber(335)).to.equal('ba trăm ba mươi lăm')
      expect(readVnNumber(995)).to.equal('chín trăm chín mươi lăm')
    })

    it('should handle numbers ending in 10', () => {
      expect(readVnNumber(110)).to.equal('một trăm mười')
      expect(readVnNumber(210)).to.equal('hai trăm mười')
      expect(readVnNumber(910)).to.equal('chín trăm mười')
    })
  })

  describe('thousands (1,000 - 999,999)', () => {
    it('should read thousands with "nghìn"', () => {
      expect(readVnNumber(1000)).to.equal('một nghìn')
      expect(readVnNumber(2000)).to.equal('hai nghìn')
      expect(readVnNumber(5000)).to.equal('năm nghìn')
      expect(readVnNumber(10000)).to.equal('mười nghìn')
      expect(readVnNumber(99000)).to.equal('chín mươi chín nghìn')
    })

    it('should handle thousands with complete groups', () => {
      expect(readVnNumber(1234)).to.equal('một nghìn hai trăm ba mươi bốn')
      expect(readVnNumber(5678)).to.equal('năm nghìn sáu trăm bảy mươi tám')
      expect(readVnNumber(12345)).to.equal(
        'mười hai nghìn ba trăm bốn mươi lăm',
      )
    })

    it('should handle thousands with zeros', () => {
      expect(readVnNumber(1001)).to.equal('một nghìn không trăm lẻ một')
      expect(readVnNumber(1010)).to.equal('một nghìn không trăm mười')
      expect(readVnNumber(1100)).to.equal('một nghìn một trăm')
      expect(readVnNumber(10001)).to.equal('mười nghìn không trăm lẻ một')
      expect(readVnNumber(10010)).to.equal('mười nghìn không trăm mười')
    })

    it('should not include zero groups in thousands', () => {
      expect(readVnNumber(2000)).to.equal('hai nghìn')
      expect(readVnNumber(50000)).to.equal('năm mươi nghìn')
    })
  })

  describe('millions (1,000,000 - 999,999,999)', () => {
    it('should read millions with "triệu"', () => {
      expect(readVnNumber(1000000)).to.equal('một triệu')
      expect(readVnNumber(2000000)).to.equal('hai triệu')
      expect(readVnNumber(5000000)).to.equal('năm triệu')
      expect(readVnNumber(10000000)).to.equal('mười triệu')
    })

    it('should handle millions with thousands', () => {
      expect(readVnNumber(1500000)).to.equal('một triệu năm trăm nghìn')
      expect(readVnNumber(2450000)).to.equal(
        'hai triệu bốn trăm năm mươi nghìn',
      )
      expect(readVnNumber(19990000)).to.equal(
        'mười chín triệu chín trăm chín mươi nghìn',
      )
    })

    it('should handle millions with complete number', () => {
      expect(readVnNumber(1234567)).to.equal(
        'một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy',
      )
      expect(readVnNumber(199000)).to.equal('một trăm chín mươi chín nghìn')
    })

    it('should handle millions with zeros in middle', () => {
      expect(readVnNumber(1000001)).to.equal('một triệu không trăm lẻ một')
      expect(readVnNumber(1000100)).to.equal('một triệu một trăm')
      expect(readVnNumber(1001000)).to.equal(
        'một triệu không trăm lẻ một nghìn',
      )
      expect(readVnNumber(5000050)).to.equal('năm triệu không trăm năm mươi')
      expect(readVnNumber(600001)).to.equal('sáu trăm nghìn không trăm lẻ một')
      expect(readVnNumber(1060000)).to.equal(
        'một triệu không trăm sáu mươi nghìn',
      )
    })
  })

  describe('billions (1,000,000,000+)', () => {
    it('should read billions with "tỷ"', () => {
      expect(readVnNumber(1000000000)).to.equal('một tỷ')
      expect(readVnNumber(2000000000)).to.equal('hai tỷ')
      expect(readVnNumber(5000000000)).to.equal('năm tỷ')
      expect(readVnNumber(10000000000)).to.equal('mười tỷ')
      expect(readVnNumber('2000000000')).to.equal('hai tỷ')
    })

    it('should handle billions with millions', () => {
      expect(readVnNumber(2500000000)).to.equal('hai tỷ năm trăm triệu')
      expect(readVnNumber(15000000000)).to.equal('mười lăm tỷ')
      expect(readVnNumber(BigInt(2500000000))).to.equal('hai tỷ năm trăm triệu')
    })

    it('should handle billions with complete groups', () => {
      expect(readVnNumber(1234567890)).to.equal(
        'một tỷ hai trăm ba mươi bốn triệu năm trăm sáu mươi bảy nghìn tám trăm chín mươi',
      )
      expect(readVnNumber(123000000000)).to.equal('một trăm hai mươi ba tỷ')
    })

    it('should handle trillions (nghìn tỷ)', () => {
      expect(readVnNumber(1000000000000)).to.equal('một nghìn tỷ')
      expect(readVnNumber('1000000000000')).to.equal('một nghìn tỷ')
      expect(readVnNumber('12000000000000')).to.equal('mười hai nghìn tỷ')
      expect(readVnNumber('123000000000000')).to.equal(
        'một trăm hai mươi ba nghìn tỷ',
      )
    })

    it('should handle trillions with groups', () => {
      expect(readVnNumber('1001000000000')).to.equal(
        'một nghìn không trăm lẻ một tỷ',
      )
      expect(readVnNumber('1001500000000')).to.equal(
        'một nghìn không trăm lẻ một tỷ năm trăm triệu',
      )
      expect(readVnNumber('1001500100000')).to.equal(
        'một nghìn không trăm lẻ một tỷ năm trăm triệu một trăm nghìn',
      )
      expect(readVnNumber('1001500100001')).to.equal(
        'một nghìn không trăm lẻ một tỷ năm trăm triệu một trăm nghìn không trăm lẻ một',
      )
    })
  })

  describe('very large numbers (quadrillions+)', () => {
    it('should handle quadrillions (triệu tỷ)', () => {
      expect(readVnNumber('1000000000000000')).to.equal('một triệu tỷ')
      expect(readVnNumber('5000000000000000')).to.equal('năm triệu tỷ')
      expect(readVnNumber('1000001000000000')).to.equal(
        'một triệu không trăm lẻ một tỷ',
      )
    })

    it('should handle quintillions (tỷ tỷ)', () => {
      expect(readVnNumber('1000000000000000000')).to.equal('một tỷ tỷ')
      expect(readVnNumber(BigInt('1000000000000000000'))).to.equal('một tỷ tỷ')
    })

    it('should handle very large numbers with all groups', () => {
      expect(readVnNumber('1234567890123456')).to.equal(
        'một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy tỷ tám trăm chín mươi triệu một trăm hai mươi ba nghìn bốn trăm năm mươi sáu',
      )
    })
  })

  describe('numbers with zeros in various positions', () => {
    it('should handle zeros at the end', () => {
      expect(readVnNumber(10)).to.equal('mười')
      expect(readVnNumber(100)).to.equal('một trăm')
      expect(readVnNumber(1000)).to.equal('một nghìn')
      expect(readVnNumber(10000)).to.equal('mười nghìn')
      expect(readVnNumber(100000)).to.equal('một trăm nghìn')
    })

    it('should handle zeros in the middle of groups', () => {
      expect(readVnNumber(101)).to.equal('một trăm lẻ một')
      expect(readVnNumber(1001)).to.equal('một nghìn không trăm lẻ một')
      expect(readVnNumber(10001)).to.equal('mười nghìn không trăm lẻ một')
    })

    it('should skip empty groups', () => {
      expect(readVnNumber(1000000)).to.equal('một triệu')
      expect(readVnNumber(1000000000)).to.equal('một tỷ')
    })
  })

  describe('input type variations', () => {
    it('should handle number input', () => {
      expect(readVnNumber(12345)).to.equal(
        'mười hai nghìn ba trăm bốn mươi lăm',
      )
      expect(readVnNumber(2000000000)).to.equal('hai tỷ')
    })

    it('should handle string input', () => {
      expect(readVnNumber('12345')).to.equal(
        'mười hai nghìn ba trăm bốn mươi lăm',
      )
      expect(readVnNumber('2000000000')).to.equal('hai tỷ')
    })

    it('should handle bigint input', () => {
      expect(readVnNumber(BigInt(12345))).to.equal(
        'mười hai nghìn ba trăm bốn mươi lăm',
      )
      expect(readVnNumber(BigInt(2000000000))).to.equal('hai tỷ')
      expect(readVnNumber(BigInt('9999999999999999'))).to.equal(
        'chín triệu chín trăm chín mươi chín nghìn chín trăm chín mươi chín tỷ chín trăm chín mươi chín triệu chín trăm chín mươi chín nghìn chín trăm chín mươi chín',
      )
    })
  })

  describe('edge cases and special patterns', () => {
    it('should handle 11 (no "mốt")', () => {
      expect(readVnNumber(11)).to.equal('mười một')
    })

    it('should handle 111', () => {
      expect(readVnNumber(111)).to.equal('một trăm mười một')
    })

    it('should handle numbers ending in 05', () => {
      expect(readVnNumber(105)).to.equal('một trăm lẻ năm')
      expect(readVnNumber(205)).to.equal('hai trăm lẻ năm')
    })

    it('should handle numbers ending in 15', () => {
      expect(readVnNumber(115)).to.equal('một trăm mười lăm')
      expect(readVnNumber(215)).to.equal('hai trăm mười lăm')
    })

    it('should handle 1111', () => {
      expect(readVnNumber(1111)).to.equal('một nghìn một trăm mười một')
    })

    it('should handle repeating patterns', () => {
      expect(readVnNumber(222)).to.equal('hai trăm hai mươi hai')
      expect(readVnNumber(333)).to.equal('ba trăm ba mươi ba')
      expect(readVnNumber(555)).to.equal('năm trăm năm mươi lăm')
    })

    it('should handle numbers with all different special cases', () => {
      expect(readVnNumber(1215)).to.equal('một nghìn hai trăm mười lăm')
      expect(readVnNumber(2125)).to.equal('hai nghìn một trăm hai mươi lăm')
      expect(readVnNumber(3121)).to.equal('ba nghìn một trăm hai mươi mốt')
    })
  })

  describe('groups with leading zeros (0XX patterns)', () => {
    it('should handle 001 pattern in various positions', () => {
      expect(readVnNumber(1001)).to.equal('một nghìn không trăm lẻ một')
      expect(readVnNumber(1001001)).to.equal(
        'một triệu không trăm lẻ một nghìn không trăm lẻ một',
      )
    })

    it('should handle 068 pattern (0 + tens + ones)', () => {
      expect(readVnNumber(1068)).to.equal('một nghìn không trăm sáu mươi tám')
      expect(readVnNumber(10068)).to.equal('mười nghìn không trăm sáu mươi tám')
      expect(readVnNumber(100068)).to.equal(
        'một trăm nghìn không trăm sáu mươi tám',
      )
    })

    it('should handle 060 pattern (0 + tens + 0)', () => {
      expect(readVnNumber(1060)).to.equal('một nghìn không trăm sáu mươi')
      expect(readVnNumber(2060)).to.equal('hai nghìn không trăm sáu mươi')
    })

    it('should handle 010 through 090 patterns', () => {
      expect(readVnNumber(1010)).to.equal('một nghìn không trăm mười')
      expect(readVnNumber(1020)).to.equal('một nghìn không trăm hai mươi')
      expect(readVnNumber(1030)).to.equal('một nghìn không trăm ba mươi')
      expect(readVnNumber(1090)).to.equal('một nghìn không trăm chín mươi')
    })

    it('should handle 011 through 019 patterns', () => {
      expect(readVnNumber(1011)).to.equal('một nghìn không trăm mười một')
      expect(readVnNumber(1015)).to.equal('một nghìn không trăm mười lăm')
      expect(readVnNumber(1019)).to.equal('một nghìn không trăm mười chín')
    })

    it('should handle 021, 031, etc. (0 + tens + 1 with mốt)', () => {
      expect(readVnNumber(1021)).to.equal('một nghìn không trăm hai mươi mốt')
      expect(readVnNumber(1031)).to.equal('một nghìn không trăm ba mươi mốt')
      expect(readVnNumber(1091)).to.equal('một nghìn không trăm chín mươi mốt')
    })

    it('should handle 025, 035, etc. (0 + tens + 5 with lăm)', () => {
      expect(readVnNumber(1025)).to.equal('một nghìn không trăm hai mươi lăm')
      expect(readVnNumber(1035)).to.equal('một nghìn không trăm ba mươi lăm')
      expect(readVnNumber(1095)).to.equal('một nghìn không trăm chín mươi lăm')
    })

    it('should handle 002 through 009 patterns', () => {
      expect(readVnNumber(1002)).to.equal('một nghìn không trăm lẻ hai')
      expect(readVnNumber(1003)).to.equal('một nghìn không trăm lẻ ba')
      expect(readVnNumber(1005)).to.equal('một nghìn không trăm lẻ năm')
      expect(readVnNumber(1009)).to.equal('một nghìn không trăm lẻ chín')
    })
  })

  describe('all tens patterns (X0, X1-X9)', () => {
    it('should handle all X0 patterns correctly', () => {
      expect(readVnNumber(10)).to.equal('mười')
      expect(readVnNumber(20)).to.equal('hai mươi')
      expect(readVnNumber(30)).to.equal('ba mươi')
      expect(readVnNumber(40)).to.equal('bốn mươi')
      expect(readVnNumber(50)).to.equal('năm mươi')
      expect(readVnNumber(60)).to.equal('sáu mươi')
      expect(readVnNumber(70)).to.equal('bảy mươi')
      expect(readVnNumber(80)).to.equal('tám mươi')
      expect(readVnNumber(90)).to.equal('chín mươi')
    })

    it('should handle all X1 patterns correctly', () => {
      expect(readVnNumber(11)).to.equal('mười một')
      expect(readVnNumber(21)).to.equal('hai mươi mốt')
      expect(readVnNumber(31)).to.equal('ba mươi mốt')
      expect(readVnNumber(41)).to.equal('bốn mươi mốt')
      expect(readVnNumber(51)).to.equal('năm mươi mốt')
      expect(readVnNumber(61)).to.equal('sáu mươi mốt')
      expect(readVnNumber(71)).to.equal('bảy mươi mốt')
      expect(readVnNumber(81)).to.equal('tám mươi mốt')
      expect(readVnNumber(91)).to.equal('chín mươi mốt')
    })

    it('should handle all X5 patterns correctly', () => {
      expect(readVnNumber(15)).to.equal('mười lăm')
      expect(readVnNumber(25)).to.equal('hai mươi lăm')
      expect(readVnNumber(35)).to.equal('ba mươi lăm')
      expect(readVnNumber(45)).to.equal('bốn mươi lăm')
      expect(readVnNumber(55)).to.equal('năm mươi lăm')
      expect(readVnNumber(65)).to.equal('sáu mươi lăm')
      expect(readVnNumber(75)).to.equal('bảy mươi lăm')
      expect(readVnNumber(85)).to.equal('tám mươi lăm')
      expect(readVnNumber(95)).to.equal('chín mươi lăm')
    })

    it('should handle X2, X3, X4, X6, X7, X8, X9 patterns', () => {
      expect(readVnNumber(22)).to.equal('hai mươi hai')
      expect(readVnNumber(33)).to.equal('ba mươi ba')
      expect(readVnNumber(44)).to.equal('bốn mươi bốn')
      expect(readVnNumber(66)).to.equal('sáu mươi sáu')
      expect(readVnNumber(77)).to.equal('bảy mươi bảy')
      expect(readVnNumber(88)).to.equal('tám mươi tám')
      expect(readVnNumber(99)).to.equal('chín mươi chín')
    })
  })

  describe('hundreds patterns (X00, X01-X09, X10-X99)', () => {
    it('should handle all X00 patterns', () => {
      expect(readVnNumber(100)).to.equal('một trăm')
      expect(readVnNumber(200)).to.equal('hai trăm')
      expect(readVnNumber(300)).to.equal('ba trăm')
      expect(readVnNumber(400)).to.equal('bốn trăm')
      expect(readVnNumber(500)).to.equal('năm trăm')
      expect(readVnNumber(600)).to.equal('sáu trăm')
      expect(readVnNumber(700)).to.equal('bảy trăm')
      expect(readVnNumber(800)).to.equal('tám trăm')
      expect(readVnNumber(900)).to.equal('chín trăm')
    })

    it('should handle all X01-X09 patterns with "lẻ"', () => {
      expect(readVnNumber(101)).to.equal('một trăm lẻ một')
      expect(readVnNumber(202)).to.equal('hai trăm lẻ hai')
      expect(readVnNumber(303)).to.equal('ba trăm lẻ ba')
      expect(readVnNumber(404)).to.equal('bốn trăm lẻ bốn')
      expect(readVnNumber(505)).to.equal('năm trăm lẻ năm')
      expect(readVnNumber(606)).to.equal('sáu trăm lẻ sáu')
      expect(readVnNumber(707)).to.equal('bảy trăm lẻ bảy')
      expect(readVnNumber(808)).to.equal('tám trăm lẻ tám')
      expect(readVnNumber(909)).to.equal('chín trăm lẻ chín')
    })

    it('should handle X10 patterns', () => {
      expect(readVnNumber(110)).to.equal('một trăm mười')
      expect(readVnNumber(210)).to.equal('hai trăm mười')
      expect(readVnNumber(310)).to.equal('ba trăm mười')
      expect(readVnNumber(910)).to.equal('chín trăm mười')
    })

    it('should handle X11-X19 patterns', () => {
      expect(readVnNumber(111)).to.equal('một trăm mười một')
      expect(readVnNumber(215)).to.equal('hai trăm mười lăm')
      expect(readVnNumber(319)).to.equal('ba trăm mười chín')
    })

    it('should handle X21, X31, etc. with "mốt"', () => {
      expect(readVnNumber(121)).to.equal('một trăm hai mươi mốt')
      expect(readVnNumber(231)).to.equal('hai trăm ba mươi mốt')
      expect(readVnNumber(341)).to.equal('ba trăm bốn mươi mốt')
    })

    it('should handle X25, X35, etc. with "lăm"', () => {
      expect(readVnNumber(125)).to.equal('một trăm hai mươi lăm')
      expect(readVnNumber(235)).to.equal('hai trăm ba mươi lăm')
      expect(readVnNumber(345)).to.equal('ba trăm bốn mươi lăm')
    })
  })

  describe('mixed magnitude numbers', () => {
    it('should handle numbers spanning all magnitudes', () => {
      expect(readVnNumber(1234)).to.equal('một nghìn hai trăm ba mươi bốn')
      expect(readVnNumber(12345)).to.equal(
        'mười hai nghìn ba trăm bốn mươi lăm',
      )
      expect(readVnNumber(123456)).to.equal(
        'một trăm hai mươi ba nghìn bốn trăm năm mươi sáu',
      )
      expect(readVnNumber(1234567)).to.equal(
        'một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy',
      )
      expect(readVnNumber(12345678)).to.equal(
        'mười hai triệu ba trăm bốn mươi lăm nghìn sáu trăm bảy mươi tám',
      )
      expect(readVnNumber(123456789)).to.equal(
        'một trăm hai mươi ba triệu bốn trăm năm mươi sáu nghìn bảy trăm tám mươi chín',
      )
    })

    it('should handle numbers with zeros in different positions', () => {
      expect(readVnNumber(100001)).to.equal('một trăm nghìn không trăm lẻ một')
      expect(readVnNumber(1000010)).to.equal('một triệu không trăm mười')
      expect(readVnNumber(10000100)).to.equal('mười triệu một trăm')
    })
  })

  describe('boundary values', () => {
    it('should handle single digit boundaries', () => {
      expect(readVnNumber(9)).to.equal('chín')
    })

    it('should handle two digit boundaries', () => {
      expect(readVnNumber(99)).to.equal('chín mươi chín')
    })

    it('should handle three digit boundaries', () => {
      expect(readVnNumber(999)).to.equal('chín trăm chín mươi chín')
    })

    it('should handle thousand boundaries', () => {
      expect(readVnNumber(9999)).to.equal('chín nghìn chín trăm chín mươi chín')
    })

    it('should handle million boundaries', () => {
      expect(readVnNumber(999999)).to.equal(
        'chín trăm chín mươi chín nghìn chín trăm chín mươi chín',
      )
    })

    it('should handle billion boundaries', () => {
      expect(readVnNumber(999999999)).to.equal(
        'chín trăm chín mươi chín triệu chín trăm chín mươi chín nghìn chín trăm chín mươi chín',
      )
    })
  })
})
